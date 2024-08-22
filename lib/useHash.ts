import { useState, useEffect } from "react"
import { tabSchema, TabSchema } from "@/lib/schemas"
import { ZodError } from "zod"
import { logZodErrors } from "@/lib/utils"

export const useHash = () => {
  const [hash, setHash] = useState<string>("")
  const [parsedData, setParsedData] = useState<Partial<TabSchema>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const parseHash = () => {
      const currentHash = window.location.hash.slice(1) // Remove the leading '#'
      setHash(currentHash)

      if (currentHash) {
        try {
          const decodedHash = decodeURIComponent(currentHash)
          const params = new URLSearchParams(decodedHash)
          const parsedParams: Record<string, any> = {}

          params.forEach((value, key) => {
            if (key === "items" || key === "splitters") {
              parsedParams[key] = tryParseJSON(value, [])
            } else if (key === "tabDescription") {
              parsedParams[key] = tryParseJSON(value, {})
            } else if (key === "tipBeforeTax") {
              parsedParams[key] = value === "true"
            } else if (key === "taxAmount" || key === "tipAmount") {
              parsedParams[key] = parseFloat(value)
            } else {
              parsedParams[key] = value
            }
          })

          try {
            const validatedData = tabSchema.parse(parsedParams)
            setParsedData(validatedData)
            setError(null)
          } catch (validationError) {
            if (validationError instanceof ZodError) {
              logZodErrors(validationError, "TabSchema")
              setError(JSON.stringify(validationError.issues, null, 2))
            } else {
              setError("An unknown validation error occurred")
            }
            setParsedData(parsedParams)
          }
        } catch (err) {
          if (err instanceof Error) {
            setError(`Parsing error: ${err.message}`)
          } else {
            setError("An unknown parsing error occurred")
          }
          setParsedData({})
        }
      } else {
        setParsedData({})
        setError(null)
      }
    }

    parseHash()
  }, [])

  function tryParseJSON(jsonString: string, defaultValue: any) {
    try {
      return JSON.parse(jsonString)
    } catch {
      return defaultValue
    }
  }

  return { hash, parsedData, error }
}
