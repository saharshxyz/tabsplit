import { DescriptionType } from "@/lib/schemas"
import { ExternalLink } from "lucide-react"

export interface PaymentLinkProps {
  type: DescriptionType
  details?: string
}

export const PaymentLink: React.FC<PaymentLinkProps> = ({ type, details }) => {
  if (!details || type === "None" || type === "Other") return <>{details}</>

  const urlMap: Record<Exclude<DescriptionType, "None" | "Other">, string> = {
    Venmo: `https://venmo.com/u/${details}`,
    PayPal: `https://paypal.me/${details}`,
    "Cash App": `https://cash.app/$${details}`
  }

  const displayMap: Record<
    Exclude<DescriptionType, "None" | "Other">,
    string
  > = {
    Venmo: `@${details}`,
    PayPal: `@${details}`,
    "Cash App": `$${details}`
  }

  return (
    <a
      href={urlMap[type as Exclude<DescriptionType, "None" | "Other">]}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link inline-flex items-center"
    >
      {displayMap[type as Exclude<DescriptionType, "None" | "Other">]}
      <ExternalLink className="ml-2" />
    </a>
  )
}
