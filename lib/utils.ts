import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"
import { SplitterSchema, TabSchema, SplitSchema } from "@/lib/schemas"

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

export function calculateSplit(data: TabSchema): SplitSchema {
  const {
    tabName,
    tabDescription,
    taxAmount,
    tipBeforeTax,
    tipAmount,
    items: unsortedItems,
    splitters: unsortedSplitters
  } = data

  // sort items and splitters alphabetically
  const items = [...unsortedItems].sort((a, b) => a.name.localeCompare(b.name))
  const formSplitters = [...unsortedSplitters].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const subTotal = items.reduce((acc, curr) => acc + curr.price, 0)

  const taxPercentage = (taxAmount / subTotal) * 100
  const tipPercentage =
    (tipAmount / (tipBeforeTax ? subTotal : subTotal + taxAmount)) * 100
  const total = subTotal + taxAmount + tipAmount

  const splitterMap = new Map<string, SplitterSchema>()

  // initialize splittes
  formSplitters.forEach(({ name }) => {
    splitterMap.set(name.toLowerCase(), {
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
    const portionCost = item.price / item.splitters.length
    item.splitters.forEach(({ name }) => {
      const splitter = splitterMap.get(name.toLowerCase())!
      splitter.subtotal += portionCost
      splitter.items.push({ name: item.name, portionCost })
    })
  })

  // calculate tax, tip, and total for each splitter
  splitterMap.forEach((splitter) => {
    splitter.taxAmount = splitter.subtotal * (taxPercentage / 100)
    splitter.tipAmount =
      (tipBeforeTax
        ? splitter.subtotal
        : splitter.subtotal + splitter.taxAmount) *
      (tipPercentage / 100)
    splitter.total = splitter.subtotal + splitter.taxAmount + splitter.tipAmount

    // Sort splitter's items by name
    splitter.items.sort((a, b) => a.name.localeCompare(b.name))
  })

  const split: SplitSchema = {
    tabName,
    tabDescription,
    taxPercentage,
    taxAmount,
    tipBeforeTax,
    tipPercentage,
    tipAmount,
    subTotal,
    total,
    items,
    splitters: Array.from(splitterMap.values())
  }

  return split
}

export function parseUrlData(
  searchParams: URLSearchParams
): Partial<TabSchema> {
  const tabName = searchParams.get("tabName") || ""
  const taxAmount = parseFloat(searchParams.get("taxAmount") || "0")
  const tipBeforeTax = searchParams.get("tipBeforeTax") === "true"
  const tipAmount = parseFloat(searchParams.get("tipAmount") || "0")

  let splitters = []
  try {
    splitters = JSON.parse(searchParams.get("splitters") || "[]")
  } catch (e) {
    console.error("Failed to parse splitters from URL")
  }

  let items = []
  try {
    items = JSON.parse(searchParams.get("items") || "[]")
  } catch (e) {
    console.error("Failed to parse items from URL")
  }

  return {
    tabName,
    taxAmount,
    tipBeforeTax,
    tipAmount,
    splitters: splitters,
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
  data: TabSchema,
  baseUrl: string = getBaseUrl()
): [string, string] {
  const params = new URLSearchParams()

  params.append("tabName", data.tabName)
  params.append("tabDescription", JSON.stringify(data.tabDescription))
  params.append("taxAmount", data.taxAmount.toString())
  params.append("tipAmount", data.tipAmount.toString())
  params.append("tipBeforeTax", data.tipBeforeTax.toString())

  params.append("items", JSON.stringify(data.items))

  params.append("splitters", JSON.stringify(data.splitters))

  const encodedParams = params
    .toString()
    .replace(/(\[|\])/g, encodeURIComponent("$1"))

  return [baseUrl, encodedParams]
}
