import * as z from "zod"

const uniqueArray = <T>(arr: T[]): boolean => arr.length === new Set(arr).size

const roughlyEqual = (
  num1: number,
  num2: number,
  marginOfError: number = 0.01
): boolean => Math.abs(num1 - num2) < marginOfError

const nameSchema = z
  .string()
  .min(1, { message: "Name must be at least 1 character long." })
const dollarAmountSchema = z.coerce
  .number()
  .positive({ message: "Dollar amount must be positive" })
const percentageSchema = z.coerce.number().positive()

const uniqueNameArraySchema = <T extends { name: string }>(
  schema: z.ZodType<T>
) =>
  z
    .array(schema)
    .min(1, "At least one element is required")
    .refine((arr) => uniqueArray(arr.map((item) => item.name)), {
      message: "Names must be unique"
    }) as z.ZodType<T[], z.ZodTypeDef, T[]>

const itemSchema = z.object({
  name: nameSchema,
  price: dollarAmountSchema,
  splitters: uniqueNameArraySchema(z.object({ name: nameSchema })).describe(
    "People who split this item"
  )
})

const splitItemSchema = z.object({
  name: nameSchema,
  portionCost: dollarAmountSchema
})

const splitterSchema = z
  .object({
    name: nameSchema,
    items: uniqueNameArraySchema(splitItemSchema),
    subtotal: dollarAmountSchema,
    taxAmount: dollarAmountSchema,
    tipAmount: dollarAmountSchema,
    total: dollarAmountSchema
  })
  .refine(
    ({ items, subtotal }) =>
      roughlyEqual(
        subtotal,
        items.reduce((acc, item) => acc + item.portionCost, 0)
      ),
    {
      message: "Portion costs should equal subtotal"
    }
  )
export type SplitterSchema = z.infer<typeof splitterSchema>

export const descriptionTypes = [
  "None",
  "Venmo",
  "Cash App",
  "PayPal",
  "Other"
] as const
export type DescriptionType = (typeof descriptionTypes)[number]

const baseSchema = z.object({
  tabName: nameSchema,
  tabDescription: z
    .object({
      type: z
        .enum(descriptionTypes, {
          required_error: "Description type is required"
        })
        .default("None"),
      details: z
        .string()
        .optional()
        .refine((val) => !val || !(val.includes("@") || val.includes("$")), {
          message: "Details must not include @ or $"
        })
    })
    .refine(
      (data) => {
        if (data.type !== "None") {
          return !!data.details && data.details.trim().length > 0
        }
        return true
      },
      {
        message: "Details are required when type is not None",
        path: ["details"]
      }
    ),
  taxPercentage: percentageSchema,
  taxAmount: dollarAmountSchema,
  tipBeforeTax: z.boolean().default(true),
  tipPercentage: percentageSchema,
  tipAmount: z.coerce.number().min(0),
  subTotal: dollarAmountSchema,
  total: dollarAmountSchema,
  items: z.array(itemSchema).min(1, { message: "Must have at least one item" }),
  splitters: z.array(splitterSchema).min(1)
})

const splittersAndItemsRefine = (
  items: z.infer<typeof itemSchema>[],
  splitters: { name: string }[]
) =>
  items.every((item) =>
    item.splitters.every((splitter) =>
      splitters.some((e) => e.name === splitter.name)
    )
  )

export const tabSchema = baseSchema
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
  .refine(({ items, splitters }) => splittersAndItemsRefine(items, splitters), {
    message: "All splitters must be present in the items' splitters arrays.",
    path: ["items", "splitters"]
  })
  .refine(({ items }) => uniqueArray(items.map((item) => item.name)), {
    message: "Item names must be unique.",
    path: ["items"]
  })
export type TabSchema = z.infer<typeof tabSchema>

export const partialTabSchema = z.object({
  tabName: z.string(),
  taxAmount: z.number(),
  tipAmount: z.number(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number()
    })
  )
})
export type PartialTabSchema = z.infer<typeof partialTabSchema>

export const splitSchema = baseSchema
  .refine(
    ({ items, splitters }) =>
      splittersAndItemsRefine(
        items,
        splitters.map((e) => ({ name: e.name }))
      ),
    {
      message: "All splitters must be present in the 'splitters' array.",
      path: ["items", "splitters"]
    }
  )
  .refine(
    ({ items, splitters }) => {
      const itemSplitters = new Set(
        items.flatMap((item) => item.splitters.map((e) => e.name))
      )
      return splitters.every((splitter) => itemSplitters.has(splitter.name))
    },
    {
      message:
        "All splitters must be included in at least one item's splitters array.",
      path: ["items", "splitters"]
    }
  )
  .refine(
    ({ subTotal, tipAmount, taxAmount, total }) =>
      roughlyEqual(total, subTotal + tipAmount + taxAmount),
    {
      message:
        "Total must equal the sum of subtotal, tip amount, and tax amount.",
      path: ["total"]
    }
  )
  .refine(({ total, subTotal }) => total > subTotal, {
    message: "Total must be greater than subtotal.",
    path: ["total", "subTotal"]
  })
  .refine(
    ({ total, splitters }) =>
      roughlyEqual(
        total,
        splitters.reduce((sum, splitter) => sum + splitter.total, 0)
      ),
    {
      message: "Sum of splitter totals must equal the overall total.",
      path: ["total", "splitters"]
    }
  )
  .refine(
    ({ subTotal, items }) =>
      roughlyEqual(
        subTotal,
        items.reduce((sum, item) => sum + item.price, 0)
      ),
    {
      message: "Sum of item prices must equal the subtotal.",
      path: ["subTotal", "items"]
    }
  )
  .refine(
    ({ tipAmount, tipPercentage, subTotal }) =>
      roughlyEqual(tipAmount, (subTotal * tipPercentage) / 100),
    {
      message: "Tip amount must be consistent with tip percentage.",
      path: ["tipAmount", "tipPercentage"]
    }
  )

export type SplitSchema = z.infer<typeof splitSchema>
