import { Link } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"
import { ReceiptText, TextCursorInput } from "lucide-react"
import { Button } from "src/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from "src/components/ui/card"
import { generateExampleTab } from "~/lib/utils"

export const Route = createFileRoute("/example")({
	component: RouteComponent
})

function RouteComponent() {
	const exampleTab = generateExampleTab()

	return (
		<main className="flex min-h-dvh items-center justify-center overflow-hidden">
			<Card className="w-full max-w-md p-6">
				<CardHeader>
					<CardTitle className="text-center">See Example TabSplits</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col space-y-4">
					<Link to="/" search={exampleTab}>
						<Button className="w-full" variant="outline">
							See Tab
							<TextCursorInput className="ml-2" strokeWidth={2.25} />
						</Button>
					</Link>
					<Link to="/split" search={exampleTab}>
						<Button className="w-full">
							See Split
							<ReceiptText className="ml-2" strokeWidth={2.25} />
						</Button>
					</Link>
				</CardContent>
				<CardFooter>
					Returning to this page will show different examples each time.
					Examples are randomly generated and may be nonsensical.
				</CardFooter>
			</Card>
		</main>
	)
}
