"use client"

import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingCard } from "@/components/LoadingCard"
import { SplittingForm } from "./components/SplittingForm"

export default function Home() {
  return (
    <main className="mx-auto">
      <Suspense fallback={<LoadingCard title="Loading Split Form" />}>
        <Card>
          <CardContent>
            <SplittingForm />
          </CardContent>
        </Card>
      </Suspense>
    </main>
  )
}
