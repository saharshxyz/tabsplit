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

export function calculateSplit(data: FormSchema): SplitSchema {
  const {
    checkName,
    taxAmount,
    tipBeforeTax,
    tipAmount,
    items: unsortedItems,
    eaters: unsortedEaters
  } = data

  // sort items and eaters alphabetically
  const items = [...unsortedItems].sort((a, b) => a.name.localeCompare(b.name))
  const formEaters = [...unsortedEaters].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const subTotal = items.reduce((acc, curr) => acc + curr.price, 0)

  const taxPercentage = (taxAmount / subTotal) * 100
  const tipPercentage =
    (tipAmount / (tipBeforeTax ? subTotal : subTotal + taxAmount)) * 100
  const total = subTotal + taxAmount + tipAmount

  const eaterMap = new Map<string, EaterSchema>()

  // initialize eaters
  formEaters.forEach(({ name }) => {
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
  items.forEach((item) => {
    const portionCost = item.price / item.eaters.length
    item.eaters.forEach(({ name }) => {
      const eater = eaterMap.get(name.toLowerCase())!
      eater.subtotal += portionCost
      eater.items.push({ name: item.name, portionCost })
    })
  })

  // calculate tax, tip, and total for each eater
  eaterMap.forEach((eater) => {
    eater.taxAmount = eater.subtotal * (taxPercentage / 100)
    eater.tipAmount =
      (tipBeforeTax ? eater.subtotal : eater.subtotal + eater.taxAmount) *
      (tipPercentage / 100)
    eater.total = eater.subtotal + eater.taxAmount + eater.tipAmount

    // Sort eater's items by name
    eater.items.sort((a, b) => a.name.localeCompare(b.name))
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

export function parseUrlData(
  searchParams: URLSearchParams
): Partial<FormSchema> {
  const checkName = searchParams.get("checkName") || ""
  const taxAmount = parseFloat(searchParams.get("taxAmount") || "0")
  const tipBeforeTax = searchParams.get("tipBeforeTax") === "true"
  const tipAmount = parseFloat(searchParams.get("tipAmount") || "0")

  let eaters = []
  try {
    eaters = JSON.parse(searchParams.get("eaters") || "[]")
  } catch (e) {
    console.error("Failed to parse eaters from URL")
  }

  let items = []
  try {
    items = JSON.parse(searchParams.get("items") || "[]")
  } catch (e) {
    console.error("Failed to parse items from URL")
  }

  return {
    checkName,
    taxAmount,
    tipBeforeTax,
    tipAmount,
    eaters,
    items
  }
}

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function getURLArgs(
  data: FormSchema,
  baseUrl: string = getBaseUrl()
): [string, string] {
  const params = new URLSearchParams()

  params.append("checkName", data.checkName)
  params.append("taxAmount", data.taxAmount.toString())
  params.append("tipAmount", data.tipAmount.toString())
  params.append("tipBeforeTax", data.tipBeforeTax.toString())

  params.append("items", JSON.stringify(data.items))

  params.append("eaters", JSON.stringify(data.eaters))

  const encodedParams = params
    .toString()
    .replace(/(\[|\])/g, encodeURIComponent("$1"))

  return [baseUrl, encodedParams]
}
