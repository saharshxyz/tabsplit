"use client"

import { Suspense } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { SplittingForm } from "./components/SplittingForm"

const LoadingDisplay = () => (
  <Card className="m-4">
    <CardHeader>
      <CardTitle>Loading Split Calculator</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="w-full"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Reload
      </Button>
    </CardFooter>
  </Card>
)

export default function Home() {
  return (
    <main className="mx-auto">
      <Suspense fallback={<LoadingDisplay />}>
        <Card>
          <CardContent>
            <SplittingForm />
          </CardContent>
        </Card>
      </Suspense>
    </main>
  )
}
