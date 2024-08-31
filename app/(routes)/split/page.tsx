"use client"

import { useHash } from "@/lib/useHash"
import { ErrorDisplay } from "./ErrorDisplay"
import { SplitDisplay } from "./SplitDisplay"
import { calculateSplit } from "@/lib/utils"
import { useCopyURLToClipboard } from "@/lib/useCopyURLToClipboard"
import { TabSchema } from "@/lib/schemas"
import { useEffect, useState } from "react"
import { LoadingCard } from "@/components/LoadingCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenSquare, Link as LinkIcon } from "lucide-react"

export default function Split() {
  const { hash, parsedData, error } = useHash()
  const [isLoading, setIsLoading] = useState(true)
  const copyUrlToClipboard = useCopyURLToClipboard()

  useEffect(() => {
    if (Object.keys(parsedData).length > 0 || error) {
      setIsLoading(false)
    }

    if (parsedData.tabName) {
      document.title = `${parsedData.tabName} | TabSplit`

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `View the split for ${parsedData.tabName}`
        )
      }

      updateSocialMetadata(parsedData.tabName)
    }
  }, [parsedData, error])

  const updateSocialMetadata = (tabName: string) => {
    const updateMetaTag = (
      selector: string,
      attribute: string,
      value: string
    ) => {
      const tag = document.querySelector(selector)
      if (tag) {
        tag.setAttribute(attribute, value)
      }
    }

    updateMetaTag(
      'meta[property="og:title"]',
      "content",
      `${tabName} | TabSplit`
    )
    updateMetaTag(
      'meta[property="og:description"]',
      "content",
      `View and share the split for ${tabName}`
    )
    updateMetaTag(
      'meta[name="twitter:title"]',
      "content",
      `${tabName} | TabSplit`
    )
    updateMetaTag(
      'meta[name="twitter:description"]',
      "content",
      `View and share the split for ${tabName}`
    )
  }

  useEffect(() => {
    if (Object.keys(parsedData).length > 0 || error) {
      setIsLoading(false)
    }
  }, [parsedData, error])

  return (
    <div className="mx-2 my-5">
      <div className="m-2 flex space-x-2">
        <Link href={`/#${hash}`} className="w-2/5">
          <Button variant="outline" className="w-full">
            Edit Tab
            <PenSquare className="ml-2" />
          </Button>
        </Link>
        <Button onClick={copyUrlToClipboard} className="w-3/5">
          Share Split
          <LinkIcon className="ml-2" />
        </Button>
      </div>
      {isLoading ? (
        <LoadingCard title="Loading Split ..." />
      ) : error ? (
        <ErrorDisplay error={error} />
      ) : (
        <SplitDisplay splitResult={calculateSplit(parsedData as TabSchema)} />
      )}
    </div>
  )
}
