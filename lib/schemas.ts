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
    .min(1, "At least one item is required")
    .refine((arr) => uniqueArray(arr.map((item) => item.name)), {
      message: "Names must be unique"
    }) as z.ZodType<T[], z.ZodTypeDef, T[]>

const itemSchema = z.object({
  name: nameSchema,
  price: dollarAmountSchema,
  eaters: uniqueNameArraySchema(z.object({ name: nameSchema })).describe(
    "People who ate this item"
  )
})

const eaterItemSchema = z.object({
  name: nameSchema,
  portionCost: dollarAmountSchema
})

const eaterSchema = z
  .object({
    name: nameSchema,
    items: uniqueNameArraySchema(eaterItemSchema),
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
export type EaterSchema = z.infer<typeof eaterSchema>

const baseSchema = z.object({
  checkName: nameSchema,
  taxPercentage: percentageSchema,
  taxAmount: dollarAmountSchema,
  tipBeforeTax: z.boolean().default(true),
  tipPercentage: percentageSchema,
  tipAmount: z.coerce.number().min(0),
  subTotal: dollarAmountSchema,
  total: dollarAmountSchema,
  items: z.array(itemSchema).min(1, { message: "Must have at least one item" }),
  eaters: z.array(eaterSchema).min(1)
})

const eatersAndItemsRefine = (
  items: z.infer<typeof itemSchema>[],
  eaters: { name: string }[]
) =>
  items.every((item) =>
    item.eaters.every((eater) => eaters.some((e) => e.name === eater.name))
  )

export const formSchema = baseSchema
  .pick({
    checkName: true,
    taxAmount: true,
    tipBeforeTax: true,
    tipAmount: true,
    items: true
  })
  .extend({
    eaters: uniqueNameArraySchema(z.object({ name: nameSchema }))
  })
  .refine(({ items, eaters }) => eatersAndItemsRefine(items, eaters), {
    message: "All eaters must be present in the items' eaters arrays.",
    path: ["items", "eaters"]
  })
  .refine(({ items }) => uniqueArray(items.map((item) => item.name)), {
    message: "Item names must be unique.",
    path: ["items"]
  })
export type FormSchema = z.infer<typeof formSchema>

export const splitSchema = baseSchema
  .refine(
    ({ items, eaters }) =>
      eatersAndItemsRefine(
        items,
        eaters.map((e) => ({ name: e.name }))
      ),
    {
      message: "All eaters must be present in the 'eaters' array.",
      path: ["items", "eaters"]
    }
  )
  .refine(
    ({ items, eaters }) => {
      const itemEaters = new Set(
        items.flatMap((item) => item.eaters.map((e) => e.name))
      )
      return eaters.every((eater) => itemEaters.has(eater.name))
    },
    {
      message:
        "All eaters must be included in at least one item's eaters array.",
      path: ["items", "eaters"]
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
    ({ total, eaters }) =>
      roughlyEqual(
        total,
        eaters.reduce((sum, eater) => sum + eater.total, 0)
      ),
    {
      message: "Sum of eater totals must equal the overall total.",
      path: ["total", "eaters"]
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
