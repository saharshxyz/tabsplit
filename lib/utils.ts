import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"
import { EaterSchema, FormSchema, SplitSchema } from "@/lib/schemas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const logZodErrors = (error: ZodError, schemaName: string) => {
  console.group(`${schemaName} validation failed:`)
  error.issues.forEach((issue) => {
    console.error(`- Path: ${issue.path.join(".")}, Message: ${issue.message}`)
  })
  console.groupEnd()
}

export function createSplitURL(
  data: FormSchema,
  baseUrl: string = "http://localhost:3000/split"
): [string, URLSearchParams] {
  const params = new URLSearchParams()

  params.append("checkName", data.checkName)
  params.append("taxAmount", data.taxAmount.toString())
  params.append("tipAmount", data.tipAmount.toString())
  params.append("tipBeforeTax", data.tipBeforeTax.toString())

  params.append("items", JSON.stringify(data.items))

  params.append("eaters", JSON.stringify(data.eaters))

  const url = `${baseUrl}?${params.toString()}`

  return [url.replace(/(\[|\])/g, encodeURIComponent("$1")), params]
}

export function calculateSplit(data: FormSchema): SplitSchema {
  const {
    checkName,
    taxAmount,
    tipBeforeTax,
    tipAmount,
    items,
    eaters: formEaters
  } = data

  const subTotal = items.reduce(
    (acc: number, curr: { price: number }) => acc + curr.price,
    0
  )
  const taxPercentage = (taxAmount / subTotal) * 100
  const tipPercentage =
    (tipAmount / (tipBeforeTax ? subTotal : subTotal + taxAmount)) * 100
  const total = subTotal + taxAmount + tipAmount

  const eaterMap = new Map<string, EaterSchema>()

  // initialize eaters
  formEaters.forEach(({ name }: { name: string }) => {
    eaterMap.set(name.toLowerCase(), {
      name,
      taxAmount: 0,
      tipAmount: 0,
      total: 0,
      subtotal: 0,
      items: []
    })
  })

  // calculate individual shares
  items.forEach(
    (item: { name: string; price: number; eaters: { name: string }[] }) => {
      const share = item.price / item.eaters.length
      item.eaters.forEach(({ name }: { name: string }) => {
        const eater = eaterMap.get(name.toLowerCase())!
        eater.subtotal += share
        eater.items.push({ name: item.name })
      })
    }
  )

  // calculate tax, tip, and total for each eater
  eaterMap.forEach((eater) => {
    eater.taxAmount = eater.subtotal * (taxPercentage / 100)
    eater.tipAmount =
      (tipBeforeTax ? eater.subtotal : eater.subtotal + eater.taxAmount) *
      (tipPercentage / 100)
    eater.total = eater.subtotal + eater.taxAmount + eater.tipAmount
  })

  const split: SplitSchema = {
    checkName,
    taxPercentage,
    taxAmount,
    tipBeforeTax,
    tipPercentage,
    tipAmount,
    subTotal,
    total,
    items,
    eaters: Array.from(eaterMap.values())
  }

  return split
}
