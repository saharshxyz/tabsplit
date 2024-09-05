import { DescriptionType } from "@/lib/schemas"
import { ExternalLink } from "lucide-react"
import { paymentInfo } from "@/lib/utils"

export interface PaymentLinkProps {
  type: DescriptionType
  details?: string
}

export const PaymentLink: React.FC<PaymentLinkProps> = ({ type, details }) => {
  if (!details || type === "None" || type === "Other") return <>{details}</>

  const payment = paymentInfo(type, details)

  return (
    <a
      href={payment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link inline-flex items-center"
    >
      {payment.display}
      <ExternalLink className="ml-2" />
    </a>
  )
}
