import { Link } from "@tanstack/react-router"
import { Button } from "src/components/ui/button"
import { ArrowLeft } from "lucide-react"

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