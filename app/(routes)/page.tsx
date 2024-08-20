"use client"

import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/LoadingCard"
import { SplittingForm } from "./SplittingForm"
import { useHash } from "@/lib/useHash"

export default function Home() {
  const { hash, parsedData, error } = useHash()

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
