"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import { LoadingDisplay } from "./components/LoadingDisplay"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

const DynamicSplitContent = dynamic(
  () => import("./components/SplitComponent"),
  {
    ssr: false
  }
)

export default function Split() {
  return (
    <main className="mx-auto max-w-3xl">
      <Suspense fallback={<EditBillButtonLoading />}>
        <EditBillButton />
      </Suspense>
      <Suspense fallback={<LoadingDisplay />}>
        <DynamicSplitContent />
      </Suspense>
    </main>
  )
}

function EditBillButton() {
  const searchParams = useSearchParams()

  return (
    <div className="m-2 flex justify-center">
      <Link href={`/?${searchParams.toString()}`} className="w-full">
        <Button className="w-full" variant="outline">
          Edit Bill
          <PenSquare className="ml-2 h-4 w-4" strokeWidth={2} />
        </Button>
      </Link>
    </div>
  )
}

function EditBillButtonLoading() {
  return (
    <div className="m-2 flex justify-center">
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
