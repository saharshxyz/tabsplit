import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"
import {
  SplitterSchema,
  PartialTabSchema,
  TabSchema,
  SplitSchema,
  DescriptionType
} from "@/lib/schemas"
import { faker } from "@faker-js/faker"
import dotenv from "dotenv"
import { Banknote, DollarSign } from "lucide-react"
import type { LucideIcon } from "lucide-react"

dotenv.config()

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

export const calculateSplit = (data: TabSchema): SplitSchema => {
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

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const getURLArgs = (
  data: TabSchema,
  baseUrl: string = getBaseUrl()
): [string, string] => {
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

export const transformPartialToFullTab = (
  partialTab: PartialTabSchema
): TabSchema => {
  return {
    ...partialTab,
    tabDescription: {
      type: "None"
    },
    tipBeforeTax: true,
    splitters: [],
    items: partialTab.items.map((item) => ({
      ...item,
      splitters: []
    }))
  }
}

export const generateExampleTab = (): TabSchema => {
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1)

  const mealTypes = [
    "Dinner at",
    "Lunch at",
    "Brunch at",
    "Breakfast at",
    "Drinks at",
    "Snacks at",
    "Party at",
    "Meetup at",
    "Celebration at",
    "Gathering at"
  ]

  const numItems = faker.number.int({ min: 2, max: 15 })
  const numSplitters = faker.number.int({ min: 2, max: 10 })

  const splitters = Array.from({ length: numSplitters }, () => ({
    name: faker.person.firstName()
  }))

  const items = Array.from({ length: numItems }, () => ({
    name: faker.commerce.productName(),
    price: parseFloat(faker.finance.amount({ min: 5, max: 70, dec: 2 })),
    splitters: faker.helpers
      .shuffle([...splitters])
      .slice(0, faker.number.int({ min: 1, max: numSplitters }))
  }))

  const tabDescriptionType = faker.helpers.arrayElement([
    "Venmo",
    "Cash App",
    "PayPal"
  ] as const)

  const tabDescriptionDetails = ["Venmo", "Cash App"].includes(
    tabDescriptionType
  )
    ? "saharshxyz"
    : ["PayPal"].includes(tabDescriptionType)
      ? "saharshy"
      : faker.lorem.sentence()

  return {
    tabName: `${faker.date.weekday()} ${faker.helpers.arrayElement(mealTypes)} ${faker.commerce.department()} ${capitalizeFirstLetter(faker.lorem.word({ length: { min: 5, max: 7 } }))}`,
    tabDescription: {
      type: tabDescriptionType,
      details: tabDescriptionDetails
    },
    taxAmount: parseFloat(faker.finance.amount({ min: 2, max: 20, dec: 2 })),
    tipBeforeTax: faker.datatype.boolean(),
    tipAmount: parseFloat(faker.finance.amount({ min: 5, max: 30, dec: 2 })),
    items,
    splitters
  }
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const convertReceiptToStructuredOutput = async (base64Image: string) => {
  try {
    const response = await fetch("/api/processReceiptUpload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ base64Image })
    })

    if (!response.ok) {
      throw new Error("Failed to process receipt")
    }

    return await response.json()
  } catch (error) {
    console.error("Error processing receipt:", error)
    throw error
  }
}

export const paymentInfo = (
  type: Exclude<DescriptionType, "None" | "Other">,
  details: string
): { url: string; type: string; display: string; icon: LucideIcon } => {
  const urlMap: Record<Exclude<DescriptionType, "None" | "Other">, string> = {
    Venmo: `https://venmo.com/u/${details}`,
    PayPal: `https://paypal.me/${details}`,
    "Cash App": `https://cash.app/$${details}`
  }

  const displayMap: Record<
    Exclude<DescriptionType, "None" | "Other">,
    string
  > = {
    Venmo: `@${details}`,
    PayPal: `@${details}`,
    "Cash App": `$${details}`
  }

  const iconMap: Record<
    Exclude<DescriptionType, "None" | "Other">,
    LucideIcon
  > = {
    Venmo: Banknote,
    PayPal: Banknote,
    "Cash App": DollarSign
  }

  return {
    url: urlMap[type],
    type,
    display: displayMap[type],
    icon: iconMap[type]
  }
}
