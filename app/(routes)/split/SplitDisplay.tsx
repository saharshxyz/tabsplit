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
import {
  SplitSchema,
  DescriptionType,
  NameSchema,
  DollarAmountSchema
} from "@/lib/schemas"
import { SplitCharts } from "./Charts"
import React, { useEffect, useRef } from "react"
import { paymentInfo } from "@/lib/utils"
import { toast } from "sonner"
import { PaymentLink } from "@/components/PaymentLink"
import { Button } from "@/components/ui/button"

interface SplitDisplayProps {
  splitResult: SplitSchema
}

interface TabDescriptionProps {
  tabDescription: {
    type: DescriptionType
    details?: string
  }
}

const TabDescription: React.FC<TabDescriptionProps> = ({ tabDescription }) => {
  if (tabDescription.type === "None" || !tabDescription.details) return null

  if (tabDescription.type === "Other") {
    return <CardDescription>{tabDescription.details}</CardDescription>
  }

  const payment = paymentInfo(tabDescription.type, tabDescription.details)

  return (
    <CardDescription>
      {payment.type}:{" "}
      <PaymentLink
        type={tabDescription.type}
        details={tabDescription.details}
      ></PaymentLink>
    </CardDescription>
  )
}

const VenmoPayButton = ({
  tabDescription,
  note,
  amount
}: {
  tabDescription: { type: DescriptionType; details?: string }
  note: string
  amount: number
}) => {
  if (tabDescription.type !== "Venmo" || !tabDescription.details) return null

  const { icon: Icon, url } = paymentInfo("Venmo", tabDescription.details)

  return (
    <a
      href={`${url}?txn=pay&amount=${amount.toFixed(2)}&note=${encodeURI(note)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button size="sm" className="text-xs" variant={"default"}>
        <Icon className="mr-2" />
        Pay Split
      </Button>
    </a>
  )
}

export const SplitDisplay: React.FC<SplitDisplayProps> = ({ splitResult }) => {
  const toastShownRef = useRef(false)

  useEffect(() => {
    if (
      !toastShownRef.current &&
      splitResult.tabDescription.type !== "Other" &&
      splitResult.tabDescription.type !== "None" &&
      splitResult.tabDescription.type !== "Venmo" &&
      splitResult.tabDescription.details
    ) {
      const payment = paymentInfo(
        splitResult.tabDescription.type,
        splitResult.tabDescription.details
      )
      setTimeout(() => {
        toast(`${payment.type}: ${payment.display}`, {
          action: {
            label: "Pay",
            onClick: () => {
              if (payment.url) {
                window.open(payment.url, "_blank", "noopener")
              }
            }
          },
          closeButton: true,
          duration: Infinity,
          icon: <payment.icon />
        })
      })
      toastShownRef.current = true
    }
  }, [splitResult.tabDescription])

  return (
    <Card className="mb-1">
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
            showSplitters={true}
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
            {splitResult.splitters.map((splitter, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {splitter.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl">{splitter.name}</CardTitle>
                    </div>
                    <VenmoPayButton
                      tabDescription={splitResult.tabDescription}
                      note={splitResult.tabName}
                      amount={splitter.total}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <SplitTable
                    items={splitter.items}
                    summary={{
                      subTotal: splitter.subtotal,
                      taxPercentage: 0,
                      taxAmount: splitter.taxAmount,
                      tipPercentage: 0,
                      tipAmount: splitter.tipAmount,
                      total: splitter.total
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
}
