import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert"

interface LoadingCardProps {
  title: string
}

export const LoadingCard = ({ title }: LoadingCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter>
      <Alert>
        <RefreshCcw className="h-4 w-4" />
        <AlertTitle>Try Reloading</AlertTitle>
      </Alert>
    </CardFooter>
  </Card>
)
