import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ErrorDisplayProps {
  error: string
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <Card className="border-red-500">
    <CardHeader>
      <CardTitle className="text-red-600">Validation Error</CardTitle>
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
