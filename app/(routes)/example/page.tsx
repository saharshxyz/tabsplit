"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { getURLArgs } from "@/lib/utils"
import { useState, useEffect } from "react"
import { TextCursorInput, ReceiptText } from "lucide-react"

function getRandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Example() {
  const [randomFormParams, setRandomFormParams] = useState("")
  const [randomSplitParams, setRandomSplitParams] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRandomParams = async () => {
      try {
        const exampleChecks = await import("@/public/exampleChecks.json")
        const exampleChecksArray = Object.values(exampleChecks.default)

        setRandomFormParams(getURLArgs(getRandomElement(exampleChecksArray))[1])
        setRandomSplitParams(
          getURLArgs(getRandomElement(exampleChecksArray))[1]
        )
      } catch (error) {
        console.error("Failed to load example checks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRandomParams()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">See Example Checks</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <Link href={`/#${randomFormParams}`}>
                <Button className="w-full" variant="outline">
                  See Form
                  <TextCursorInput className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
              <Link href={`/split#${randomSplitParams}`}>
                <Button className="w-full">
                  See Split
                  <ReceiptText className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
