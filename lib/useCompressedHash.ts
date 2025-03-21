import { useState, useEffect } from 'react'
import { TabSchema } from '@/lib/schemas'
import { decompressFromHash } from './hashCompression'

function safeJSONParse<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue
  try {
    return JSON.parse(value) as T
  } catch {
    return defaultValue
  }
}

export function useCompressedHash() {
  const [hash, setHash] = useState<string>('')
  const [parsedData, setParsedData] = useState<Partial<TabSchema>>({})
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1)
      setHash(newHash)

      if (!newHash) {
        setParsedData({})
        return
      }

      try {
        const params = decompressFromHash(newHash)

        const tabData: Partial<TabSchema> = {
          tabName: params.get("tabName") || undefined,
          tabDescription: safeJSONParse(params.get("tabDescription"), { type: "None" }),
          taxAmount: params.get("taxAmount")
            ? Number(params.get("taxAmount"))
            : undefined,
          tipBeforeTax: params.get("tipBeforeTax")
            ? params.get("tipBeforeTax") === "true"
            : undefined,
          tipAmount: params.get("tipAmount")
            ? Number(params.get("tipAmount"))
            : undefined,
          splitters: safeJSONParse(params.get("splitters"), []),
          items: safeJSONParse(params.get("items"), [])
        }

        setParsedData(tabData)
        setError('')
      } catch (err) {
        console.error("Error parsing hash:", err)
        setError(`Error parsing URL: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return { hash, parsedData, error }
} 