"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { getURLArgs } from "@/lib/utils"
import { useState, useEffect } from "react"
import { TextCursorInput, ReceiptText } from "lucide-react"

export default function Example() {
  const [randomTabParams, setRandomTabParams] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRandomTab = async () => {
      function getRandomElement<T>(arr: T[]) {
        return arr[Math.floor(Math.random() * arr.length)]
      }

      try {
        const exampleTabs = await import("@/public/exampleTabs.json")
        const exampleChecksArray = Object.values(exampleTabs.default)

        setRandomTabParams(getURLArgs(getRandomElement(exampleChecksArray))[1])
      } catch (error) {
        console.error("Failed to load example checks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRandomTab()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center">See Example TabSplits</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <Link href={`/#${randomTabParams}`}>
                <Button className="w-full" variant="outline">
                  See Tab
                  <TextCursorInput className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
              <Link href={`/split#${randomTabParams}`}>
                <Button className="w-full">
                  See Split
                  <ReceiptText className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
            </>
          )}
        </CardContent>
        <CardFooter>
          Returning to this page will show different examples each time.
        </CardFooter>
      </Card>
    </main>
  )
}
