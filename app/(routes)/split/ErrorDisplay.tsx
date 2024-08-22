import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card"
import Link from "next/link"

interface ErrorDisplayProps {
  error: string
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <Card className="border-red-500">
    <CardHeader>
      <CardTitle className="text-red-600">Validation Error</CardTitle>
      <CardDescription>
        If page was generated from the example screen,{" "}
        <Link
          href={"/example"}
          className="underline underline-offset-4 duration-100 ease-in-out hover:underline-offset-1"
        >
          go back to the example page
        </Link>{" "}
        and try again.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="mb-2">
        The URL parameters failed validation. Please check the error details
        below:
      </p>
      <pre className="overflow-auto rounded-md bg-red-100 p-4 text-red-800">
        {error}
      </pre>
    </CardContent>
  </Card>
)
