import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "src/components/ui/card"
import { tabSchema } from "src/lib/schemas"
import { calculateSplit } from "src/lib/utils"
import { SplitDisplay } from "./-components/SplitDisplay"

export const Route = createFileRoute("/split/")({
	component: RouteComponent,
	validateSearch: tabSchema,
	errorComponent: (err) => ErrorDisplay(err.error.message)
})

function ErrorDisplay(error: string) {
	return (
		<Card className="border-red-500">
			<CardHeader>
				<CardTitle className="text-red-600">Validation Error</CardTitle>
				<CardDescription>
					If page was generated from the example screen,{" "}
					<Link to="/example" className="text-link">
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
}

function RouteComponent() {
	const searchParams = Route.useSearch()
	const split = calculateSplit(searchParams)

	return <SplitDisplay splitResult={split} />
}
