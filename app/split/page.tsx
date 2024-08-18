"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import { LoadingDisplay } from "./components/LoadingDisplay"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const DynamicSplitContent = dynamic(
  () => import("./components/SplitComponent"),
  {
    ssr: false
  }
)

export default function Split() {
  const searchParams = useSearchParams()

  return (
    <main className="mx-auto max-w-3xl">
      <div className="m-2 flex justify-center">
        <Link href={`/?${searchParams.toString()}`} className="w-full">
          <Button className="w-full" variant="outline">
            Edit Bill
            <PenSquare className="ml-2 h-4 w-4" strokeWidth={2} />
          </Button>
        </Link>
      </div>
      <Suspense fallback={<LoadingDisplay />}>
        <DynamicSplitContent />
      </Suspense>
    </main>
  )
}
