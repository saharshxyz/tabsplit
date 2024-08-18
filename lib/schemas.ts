import * as z from "zod";

const uniqueArray = <T>(arr: T[]): boolean => {
  return arr.length === new Set(arr).size;
};

const nameSchema = z.string().min(2);
const dollarAmountSchema = z.coerce.number().positive();
const percentageSchema = z.coerce.number().positive();

const uniqueNameArraySchema = z
  .array(nameSchema)
  .refine((arr) => uniqueArray(arr), {
    message: "Array contains duplicate items.",
  });

const itemSchema = z.object({
  name: nameSchema,
  price: dollarAmountSchema,
  eaters: uniqueNameArraySchema
    .default([])
    .describe("People who ate this item"),
});

const eaterSchema = z.object({
  name: nameSchema,
  items: uniqueNameArraySchema,
  subtotal: dollarAmountSchema,
  taxAmount: dollarAmountSchema,
  tipAmount: dollarAmountSchema,
  total: dollarAmountSchema,
});
export type EaterSchema = z.infer<typeof eaterSchema>;

const baseSchema = z.object({
  checkName: nameSchema,
  taxPercentage: percentageSchema,
  taxAmount: dollarAmountSchema,
  tipBeforeTax: z.boolean().default(true),
  tipPercentage: percentageSchema,
  tipAmount: dollarAmountSchema,
  subTotal: dollarAmountSchema,
  total: dollarAmountSchema,
  items: z.array(itemSchema),
  eaters: z.array(eaterSchema),
});

export const formSchema = baseSchema
  .pick({
    checkName: true,
    taxAmount: true,
    tipBeforeTax: true,
    tipAmount: true,
    items: true,
  })
  .extend({
    eaters: uniqueNameArraySchema,
  })
  .refine(({ items, eaters }) => {
    return items.every((item) =>
      item.eaters.every((eater) => eaters.includes(eater)),
    );
  });
export type FormSchema = z.infer<typeof formSchema>;

export const splitSchema = baseSchema
  .extend({})
  .refine(
    ({ items, eaters }) =>
      items.every((item) =>
        item.eaters.every((eater) => eaters.some((e) => e.name === eater)),
      ),
    {
      message: "All eaters must be present in the 'eaters' array.",
      path: ["items", "eaters"],
    },
  )
  .refine(
    ({ items, eaters }) => {
      const itemEaters = new Set(items.flatMap((item) => item.eaters));
      return eaters.every((eater) => itemEaters.has(eater.name));
    },
    {
      message:
        "All eaters must be included in at least one item's eaters array.",
      path: ["items", "eaters"],
    },
  )
  .refine(
    ({ subTotal, tipAmount, taxAmount, total }) =>
      Math.abs(total - (subTotal + tipAmount + taxAmount)) < 0.01,
    {
      message:
        "Total must equal the sum of subtotal, tip amount, and tax amount.",
      path: ["total"],
    },
  )
  .refine(({ total, subTotal }) => total > subTotal, {
    message: "Total must be greater than subtotal.",
    path: ["total", "subTotal"],
  })
  .refine(
    ({ total, eaters }) =>
      Math.abs(total - eaters.reduce((sum, eater) => sum + eater.total, 0)) <
      0.01,
    {
      message: "Sum of eater totals must equal the overall total.",
      path: ["total", "eaters"],
    },
  )
  .refine(
    ({ subTotal, items }) =>
      Math.abs(subTotal - items.reduce((sum, item) => sum + item.price, 0)) <
      0.01,
    {
      message: "Sum of item prices must equal the subtotal.",
      path: ["subTotal", "items"],
    },
  )
  .refine(
    ({ tipAmount, tipPercentage, subTotal }) =>
      Math.abs(tipAmount - (subTotal * tipPercentage) / 100) < 0.01,
    {
      message: "Tip amount must be consistent with tip percentage.",
      path: ["tipAmount", "tipPercentage"],
    },
  );

export type SplitSchema = z.infer<typeof splitSchema>;
