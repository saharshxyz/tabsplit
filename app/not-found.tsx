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
import { Shapes, Info } from "lucide-react"
import { BackButton } from "@/components/BackButton"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center overflow-hidden">
      <div className="w-full max-w-md">
        <BackButton link="/" text="Back to Home" />

        <Card className="w-full p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <CardDescription>This page could not be found</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 text-center">
            <Link href="/about">
              <Button className="w-full" variant="outline">
                Learn More
                <Info className="ml-2" strokeWidth={2.25} />
              </Button>
            </Link>
            <Link href="/example">
              <Button className="w-full">
                View Examples
                <Shapes className="ml-2" />
              </Button>
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <span className="mb-2">
              Please check the URL or navigate back to the home page.
            </span>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
