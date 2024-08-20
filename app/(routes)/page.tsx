"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SplittingForm } from "./SplittingForm"
import { useHash } from "@/lib/useHash"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { Shapes, Eraser } from "lucide-react"

export default function Home() {
  const { hash, parsedData, error } = useHash()

  const handleClearForm = () => {
    window.location.hash = ""
    window.location.reload()
  }

  return (
    <main className="mx-auto">
      <div className="m-2 flex space-x-2">
        <Link href={`/example`} className="flex-shrink-0">
          <Button variant="outline">
            See Example
            <Shapes className="ml-2 h-4 w-4" strokeWidth={2} />
          </Button>
        </Link>
        <Link href={`/`} className="flex-grow" onClick={handleClearForm}>
          <Button className="w-full">
            Clear Form
            <Eraser className="ml-2 h-4 w-4" strokeWidth={2} />
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <SplittingForm initialData={parsedData} />
        </CardContent>
      </Card>
    </main>
  )
}
