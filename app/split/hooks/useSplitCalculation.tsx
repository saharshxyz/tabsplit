import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { formSchema, SplitSchema } from "@/lib/schemas"
import { ZodError } from "zod"
import { logZodErrors } from "@/lib/utils"
import { calculateSplit } from "@/lib/utils"

export const useSplitCalculation = () => {
  const searchParams = useSearchParams()
  const [splitResult, setSplitResult] = useState<SplitSchema | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())

    // Parse complex parameters
    const parsedParams = {
      ...params,
      tipBeforeTax: params.tipBeforeTax === "true",
      items: tryParseJSON(params.items, []),
      eaters: tryParseJSON(params.eaters, [])
    }

    try {
      const parsedData = formSchema.parse(parsedParams)
      const split = calculateSplit(parsedData)
      setSplitResult(split)
      setError(null)
    } catch (error) {
      if (error instanceof Error) {
        logZodErrors(error as ZodError, "Form Schema")
        setError(
          JSON.stringify((error as ZodError).issues || error.message, null, 2)
        )
      }
    }
  }, [searchParams])

  function tryParseJSON(
    jsonString: string | null | undefined,
    defaultValue: any
  ) {
    if (!jsonString) return defaultValue
    try {
      return JSON.parse(jsonString)
    } catch {
      return defaultValue
    }
  }

  return { splitResult, error }
}
