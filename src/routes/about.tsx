import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute("/about")({
	component: About
})

import {
	Calculator,
	Lock,
	type LucideIcon,
	Share2,
	Upload,
	User
} from "lucide-react"
import type { ReactNode } from "react"
import { BackButton } from "src/components/BackButton"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "src/components/ui/card"

const Section = ({
	title,
	children
}: {
	title: string
	children: ReactNode
}) => (
	<section>
		<h2 className="mb-2 text-xl font-semibold">{title}</h2>
		{children}
	</section>
)

const FeatureItem = ({
	icon: Icon,
	title,
	description
}: {
	icon: LucideIcon
	title: string
	description: ReactNode
}) => (
	<div className="ml-2 flex items-center space-x-1">
		<Icon className="mr-3 h-5 w-5 flex-shrink-0" />
		<div>
			<h3 className="font-semibold">{title}</h3>
			<p>{description}</p>
		</div>
	</div>
)

function About() {
	return (
		<main className="mx-auto my-5 mb-10 max-w-3xl">
			<BackButton link="/" text="Back to Home" />

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">About TabSplit</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Section title="How TabSplit Works">
						<p>
							TabSplit is a simple, user-friendly tool designed with your
							privacy in mind. Here&apos;s how it works:
						</p>
						<ul className="mt-1 list-inside list-disc space-y-2 pl-4">
							<li>
								Choose to either manually enter your bill details or upload a
								picture of your receipt for automatic processing.
							</li>
							<li>
								Specify what was bought, the cost, and who&apos;s paying for
								each item.
							</li>
							<li>
								TabSplit calculates the split, including tax and tip, right in
								your browser.
							</li>
							<li>View a detailed breakdown of who owes what.</li>
							<li>
								Share the results with your friends using a secure,
								information-packed link.
							</li>
						</ul>
					</Section>

					<Section title="Your Privacy and Security">
						<p className="mb-4">
							We&apos;ve built TabSplit with a strong focus on privacy and
							security. Here&apos;s what you need to know:
						</p>
						<div className="space-y-4">
							<FeatureItem
								icon={Lock}
								title="No Data Storage"
								description="TabSplit doesn't have a database. We don't store any of your information. All calculations and data handling happen directly in your browser."
							/>
							<FeatureItem
								icon={Share2}
								title="Secure Sharing"
								description="When you share your split, all the information is encoded in the link itself. No data is sent to or stored on our servers, ensuring your bill details remain private."
							/>
							<FeatureItem
								icon={Calculator}
								title="Local Processing"
								description="All calculations occur on your device. You can verify the math yourself for complete transparency."
							/>
							<FeatureItem
								icon={Upload}
								title="Optional Receipt Upload"
								description={
									<>
										This feature uses OpenAI&apos;s API to process receipts. No
										data is stored, and you can always opt for manual entry to
										keep everything local. For details, see{" "}
										<a
											href="https://openai.com/policies/privacy-policy"
											className="text-link text-muted-foreground"
											target="_blank"
											rel="noopener noreferrer"
										>
											OpenAI&apos;s privacy policy
										</a>
										.
									</>
								}
							/>
						</div>
					</Section>

					<Section title="Who Made This?">
						<FeatureItem
							icon={User}
							title=""
							description={
								<>
									TabSplit was created by{" "}
									<a
										href="https://saharsh.xyz"
										className="text-link text-muted-foreground"
										target="_blank"
										rel="noreferrer noopener"
									>
										@saharshxyz
									</a>
									. If you have any questions or feedback, please don&apos;t
									hesitate to reach out!
								</>
							}
						/>
					</Section>
				</CardContent>
			</Card>
		</main>
	)
}
