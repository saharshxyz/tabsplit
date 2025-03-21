"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TabForm } from "./TabForm"
import { useCompressedHash } from "@/lib/useCompressedHash"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import { Shapes, Eraser, Info } from "lucide-react"

export default function Home() {
  const { parsedData } = useCompressedHash()

  const handleClearForm = () => {
    window.location.hash = ""
    window.location.reload()
  }

  return (
    <main className="mx-auto mt-5">
      <div className="m-2 flex space-x-2">
        <Link href={`/example`} className="flex-shrink-0">
          <Button variant="outline">
            View Examples
            <Shapes className="ml-2" />
          </Button>
        </Link>
        <Link href={`/`} className="flex-grow" onClick={handleClearForm}>
          <Button className="w-full">
            Clear Form
            <Eraser className="ml-2" />
          </Button>
        </Link>
        <Link href="/about" className="flex-shrink-0">
          <Button variant="outline">
            <span className="hidden sm:block">About</span>
            <Info className="sm:ml-2" />
          </Button>
        </Link>
      </div>

      <Card className="mb-1">
        <CardContent>
          <TabForm initialData={parsedData} />
        </CardContent>
      </Card>
    </main>
  )
}
