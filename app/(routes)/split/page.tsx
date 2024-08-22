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
  }, [parsedData, error])

  return (
    <main className="mx-auto mt-5 max-w-3xl">
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
    </main>
  )
}
