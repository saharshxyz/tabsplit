import * as z from "zod/v4"

const uniqueArray = <T>(arr: T[]): boolean => arr.length === new Set(arr).size

const nameSchema = z.string().min(1)
const dollarAmountSchema = z.coerce.number().nonnegative()
const percentageSchema = z.coerce.number().nonnegative()

const uniqueNameArraySchema = <T extends { name: string }>(
	schema: z.ZodType<T>,
	minLength = 2
) =>
	z
		.array(schema)
		.min(minLength)
		.refine(
			(arr) => uniqueArray(arr.map((item) => item.name)),
			"Names must be unique"
		)

const itemSchema = z.object({
	name: nameSchema.describe("The name of this item"),
	price: dollarAmountSchema.describe("The price of this item"),
	splitters: uniqueNameArraySchema(z.object({ name: nameSchema }), 1).describe(
		"People who split this item"
	)
})

const splitterSchema = z.object({
	name: nameSchema,
	items: uniqueNameArraySchema(
		z.object({
			name: nameSchema,
			portionCost: dollarAmountSchema
		}),
		1
	),
	subtotal: dollarAmountSchema,
	taxAmount: dollarAmountSchema,
	tipAmount: dollarAmountSchema,
	total: dollarAmountSchema
})

export const descriptionTypes = [
	"None",
	"Venmo",
	"Cash App",
	"PayPal",
	"Other"
] as const
export type DescriptionType = (typeof descriptionTypes)[number]

const descriptionSchema = z
	.object({
		type: z.enum(descriptionTypes).default("None"),
		details: z
			.string()
			.optional()
			.refine(
				(val) => !val || !(val.includes("@") || val.includes("$")),
				"Details must not include @ or $"
			)
	})
	.refine(
		(data) =>
			data.type !== "None"
				? !!data.details && data.details.trim().length > 0
				: true,
		{
			error: "Details are required when type is not None",
			path: ["details"]
		}
	)

const splitSchema = z.object({
	tabName: nameSchema.describe("A descriptive name for this tab/receipt"),
	tabDescription: descriptionSchema,
	taxPercentage: percentageSchema,
	taxAmount: dollarAmountSchema.describe(
		"The amount of tax paid on this tab/receipt"
	),
	tipBeforeTax: z.boolean().default(true),
	tipPercentage: percentageSchema,
	tipAmount: dollarAmountSchema.describe(
		"The dollar amount of tip given for this tab/receipt"
	),
	subTotal: dollarAmountSchema,
	total: dollarAmountSchema,
	items: uniqueNameArraySchema(itemSchema),
	splitters: uniqueNameArraySchema(splitterSchema)
})
export type SplitSchema = z.infer<typeof splitSchema>

export const tabSchema = splitSchema
	.pick({
		tabName: true,
		tabDescription: true,
		taxAmount: true,
		tipBeforeTax: true,
		tipAmount: true,
		items: true
	})
	.extend({
		splitters: uniqueNameArraySchema(z.object({ name: nameSchema }))
	})
	.refine(
		({ items, splitters }) => {
			const allSplitterNames = new Set(splitters.map((s) => s.name))
			return items.every((item) =>
				item.splitters.every((itemSplitter) =>
					allSplitterNames.has(itemSplitter.name)
				)
			)
		},
		{
			error:
				"Every person splitting an item must be in the main 'splitters' list.",
			path: ["items"]
		}
	)
export type TabSchema = z.infer<typeof tabSchema>

export const partialTabSchema = tabSchema
	.pick({
		tabName: true,
		taxAmount: true,
		tipAmount: true
	})
	.extend({
		items: uniqueNameArraySchema(
			itemSchema.pick({ name: true, price: true })
		).describe("A list of items on this tab/receipt")
	})
export type PartialTabSchema = z.infer<typeof partialTabSchema>
