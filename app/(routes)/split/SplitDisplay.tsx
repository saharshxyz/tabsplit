import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import { SplitTable } from "./Table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { SplitSchema } from "@/lib/schemas"
import { SplitCharts } from "./Charts"
import { ExternalLink } from "lucide-react"

interface SplitDisplayProps {
  splitResult: SplitSchema
}

interface TabDescriptionProps {
  tabDescription: {
    type: "None" | "Venmo" | "Cash App" | "PayPal" | "Other"
    details?: string
  }
}

const TabDescription: React.FC<TabDescriptionProps> = ({ tabDescription }) => {
  if (tabDescription.type === "None" || !tabDescription.details) return null

  const getPaymentLink = () => {
    switch (tabDescription.type) {
      case "Venmo":
        return `https://venmo.com/u/${tabDescription.details}`
      case "Cash App":
        return `https://cash.app/$${tabDescription.details}`
      case "PayPal":
        return `https://paypal.me/${tabDescription.details}`
      default:
        return "#"
    }
  }

  const getDisplayDetails = () => {
    switch (tabDescription.type) {
      case "Venmo":
      case "PayPal":
        return `@${tabDescription.details}`
      case "Cash App":
        return `$${tabDescription.details}`
      default:
        return tabDescription.details
    }
  }

  return (
    <CardDescription>
      {tabDescription.type !== "Other" ? (
        <>
          {tabDescription.type}:{" "}
          <Link
            href={getPaymentLink()}
            target="_blank"
            rel="noopener"
            className="inline-flex flex-row items-center border-b-2 border-transparent transition-colors duration-200 ease-in-out hover:border-current"
          >
            {getDisplayDetails()}
            <ExternalLink className="ml-2 h-4 w-auto" strokeWidth={2.25} />
          </Link>
        </>
      ) : (
        tabDescription.details
      )}
    </CardDescription>
  )
}

export const SplitDisplay: React.FC<SplitDisplayProps> = ({ splitResult }) => (
  <Card>
    <CardHeader className="pb-0">
      <CardTitle className="mb-1.5">
        {splitResult.tabName} - Tab Split
      </CardTitle>
      <TabDescription tabDescription={splitResult.tabDescription} />
    </CardHeader>

    <CardContent>
      <SplitCharts splitResult={splitResult} />
      <div className="space-y-6">
        <SplitTable
          items={splitResult.items}
          showEaters={true}
          summary={{
            subTotal: splitResult.subTotal,
            taxPercentage: splitResult.taxPercentage,
            taxAmount: splitResult.taxAmount,
            tipPercentage: splitResult.tipPercentage,
            tipAmount: splitResult.tipAmount,
            total: splitResult.total
          }}
        />
        <Separator />

        <div>
          <h3 className="mb-2 text-lg font-semibold">Individual Splits</h3>
          {splitResult.eaters.map((eater, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {eater.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{eater.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SplitTable
                  items={eater.items}
                  summary={{
                    subTotal: eater.subtotal,
                    taxPercentage: 0,
                    taxAmount: eater.taxAmount,
                    tipPercentage: 0,
                    tipAmount: eater.tipAmount,
                    total: eater.total
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)
