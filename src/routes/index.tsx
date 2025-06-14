import { Link, createFileRoute } from "@tanstack/react-router"
import { Eraser, Info, Shapes } from "lucide-react"
import { Button } from "src/components/ui/button"
import { Card, CardContent } from "src/components/ui/card"
import { genTab } from "~/lib/utils"

export const Route = createFileRoute("/")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<main className="mx-auto mt-5">
			<div className="m-2 flex space-x-2">
				<Link to="/example" className="flex-shrink-0">
					<Button variant="outline">
						View Examples
						<Shapes className="ml-2" />
					</Button>
				</Link>
				<div className="flex-grow">
					<Button className="w-full flow-grow">
						Clear Form
						<Eraser className="ml-2" />
					</Button>
				</div>
				<Link to="/about" className="flex-shrink-0">
					<Button variant="outline">
						<span className="hidden sm:block">About</span>
						<Info className="sm:ml-2" />
					</Button>
				</Link>
			</div>

			<Card className="mb-1">
				<CardContent>
					<TabForm />
				</CardContent>
			</Card>
		</main>
	)
}

function TabForm() {
	const searchParams = Route.useSearch()
	const initialData = genTab(searchParams)

	return (
		<pre className="overflow-auto rounded-md bg-red-100 p-4 text-red-800">
			{JSON.stringify(initialData, null, 2)}
		</pre>
	)
}
