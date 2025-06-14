import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { Info, LinkIcon, PenSquare } from "lucide-react"
import { useCallback } from "react"
import { Toaster, toast } from "sonner"
import { Button } from "src/components/ui/button"
import { tabSchema } from "src/lib/schemas"
import { genTab } from "src/lib/utils"

export const Route = createFileRoute("/split")({
	component: LayoutComponent
})

const useCopyURLToClipboard = () => {
	const copyUrlToClipboard = useCallback(() => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => toast.success("Link copied to clipboard"))
			.catch((err) => {
				console.error("Failed to copy: ", err)
				toast.error("Failed to copy URL to clipboard.")
			})
	}, [])

	return copyUrlToClipboard
}

function LayoutComponent() {
	const copyUrlToClipboard = useCopyURLToClipboard()
	const searchParams = Route.useSearch()
	const parsedTab = tabSchema.safeParse(searchParams)

	return (
		<div className="mx-auto mt-5 max-w-3xl">
			<Toaster richColors expand={false} position="bottom-center" />
			<div className="m-2 flex space-x-2">
				<Link
					to="/"
					search={parsedTab.success ? parsedTab.data : genTab(searchParams)}
					className="flex-shrink-0"
				>
					<Button variant="outline" className="w-full">
						Edit Tab
						<PenSquare className="ml-2" />
					</Button>
				</Link>
				<Button onClick={copyUrlToClipboard} className="flex-grow">
					Share Split
					<LinkIcon className="ml-2" />
				</Button>
				<Link to="/about" className="flex-shrink-0">
					<Button variant="outline">
						<span className="hidden sm:block">About</span>
						<Info className="sm:ml-2" />
					</Button>
				</Link>
			</div>
			<Outlet />
		</div>
	)
}
