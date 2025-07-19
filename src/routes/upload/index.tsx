import { createFileRoute } from "@tanstack/react-router"
import { BackButton } from "src/components/BackButton"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "src/components/ui/card"
import { UploadForm } from "./-components/UploadForm"

export const Route = createFileRoute("/upload/")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<main className="mx-auto flex min-h-dvh items-center justify-center overflow-hidden">
			<div className="w-full">
				<BackButton link="/" text="Back to Home" />

				<Card className="w-full p-10">
					<CardHeader>
						<CardTitle className="text-2xl text-center">
							Upload Receipt
						</CardTitle>
						<CardDescription>
							Upload a picture of your receipt and you will be redirected to a
							pre-filled form. Note that this uses OpenAI and results may vary.
							We recommend verifying the auto-populated data.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UploadForm />
					</CardContent>
				</Card>
			</div>
		</main>
	)
}
