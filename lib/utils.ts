import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"
import { FormSchema } from "@/lib/schemas"

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
