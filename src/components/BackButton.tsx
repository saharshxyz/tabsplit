import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Button } from "src/components/ui/button"

interface BackButtonProps {
	link: string
	text: string
}

export const BackButton = ({ link, text }: BackButtonProps) => (
	<Link to={link} className="m-2 mb-2 inline-block">
		<Button variant="link">
			<ArrowLeft className="mr-2 h-4 w-4" /> {text}
		</Button>
	</Link>
)
