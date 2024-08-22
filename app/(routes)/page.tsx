"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TabForm } from "./TabForm"
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
            <Shapes className="ml-2" strokeWidth={2.25} />
          </Button>
        </Link>
        <Link href={`/`} className="flex-grow" onClick={handleClearForm}>
          <Button className="w-full">
            Clear Form
            <Eraser className="ml-2" strokeWidth={2.25} />
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <TabForm initialData={parsedData} />
        </CardContent>
      </Card>
    </main>
  )
}
