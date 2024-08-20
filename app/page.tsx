"use client"

import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/LoadingCard"
import { SplittingForm } from "./SplittingForm"
import { useHash } from "@/lib/useHash"
import { useEffect } from "react"

export default function Home() {
  const { hash, parsedData, error } = useHash()

  useEffect(() => {
    console.log(hash)
    console.log(parsedData)
    console.log(error)
    if (error == undefined || error != null) {
      console.log(1)
      console.error(error)
    }
  }, [hash, parsedData, error])

  return (
    <main className="mx-auto">
      <Suspense fallback={<LoadingCard title="Loading Split Form" />}>
        <Card>
          <CardContent>
            <SplittingForm initialData={parsedData} />
          </CardContent>
        </Card>
      </Suspense>
    </main>
  )
}
