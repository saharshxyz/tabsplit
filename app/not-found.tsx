import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { NotepadTextDashed, TextCursorInput } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription>This page could not be found</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 text-center">
          <Link href="/">
            <Button className="w-full" variant="outline">
              Go Home
              <TextCursorInput className="ml-2" strokeWidth={2.25} />
            </Button>
          </Link>
          <Link href="/example">
            <Button className="w-full">
              See examples
              <NotepadTextDashed className="ml-2" />
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Please check the URL or navigate back to the home page.
        </CardFooter>
      </Card>
    </main>
  )
}
