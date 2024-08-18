import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw } from "lucide-react"

export const LoadingDisplay = () => (
  <Card className="m-4">
    <CardHeader>
      <CardTitle>Loading Bill Split</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="w-full"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Reload
      </Button>
    </CardFooter>
  </Card>
)
