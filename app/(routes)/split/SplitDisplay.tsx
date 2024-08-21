import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, User } from "lucide-react"
import { SplitSchema } from "@/lib/schemas"
import { SplitCharts } from "./Charts"

interface ItemRowProps {
  item: {
    name: string
    price?: number
    portionCost?: number
    eaters?: { name: string }[]
  }
  showEaters?: boolean
}

const ItemRow: React.FC<ItemRowProps> = ({ item, showEaters = false }) => (
  <TableRow className="w-full border-0 leading-tight">
    <TableCell className={`${showEaters ? "w-3/12" : "w-full"} py-2 pr-1.5`}>
      {item.name}
    </TableCell>
    <TableCell className={`${showEaters ? "w-full" : ""} py-2 text-right`}>
      {showEaters && item.eaters && (
        <div className="flex items-center justify-end">
          {item.eaters.length > 1 ? (
            <Users className="mr-2 hidden h-4 w-4 sm:inline-block" />
          ) : (
            <User className="mr-2 hidden h-4 w-4 sm:inline-block" />
          )}
          {item.eaters.map((eater) => eater.name).join(", ")}
        </div>
      )}
    </TableCell>
    <TableCell className="w-24 py-2 pl-0 text-right">
      ${item.price ? item.price.toFixed(2) : item.portionCost?.toFixed(2)}
    </TableCell>
  </TableRow>
)

interface SummaryRowProps {
  label: string
  amount: number
  variant?: "muted" | "emphasis" | "bold" | "normal"
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  amount,
  variant = "normal"
}) => {
  const variantClasses: Record<
    NonNullable<SummaryRowProps["variant"]>,
    string
  > = {
    muted: "text-sm text-muted-foreground",
    emphasis: "font-medium",
    bold: "font-bold",
    normal: ""
  }

  return (
    <TableRow
      className={`${variant === "bold" ? "!border-t" : "border-0"} leading-tight ${variantClasses[variant]}`}
    >
      <TableCell className="py-2" colSpan={2}>
        {label}
      </TableCell>
      <TableCell className="py-2 text-right">${amount.toFixed(2)}</TableCell>
    </TableRow>
  )
}

interface SplitTableProps {
  items: ItemRowProps["item"][]
  showEaters?: boolean
  summary: {
    subTotal: number
    taxPercentage: number | undefined
    taxAmount: number
    tipPercentage: number | undefined
    tipAmount: number
    total: number
  }
}

const SplitTable: React.FC<SplitTableProps> = ({
  items,
  showEaters = false,
  summary
}) => (
  <Table>
    {showEaters && (
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="w-full text-right">Eaters</TableHead>
          <TableHead className="w-24 text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
    )}
    <TableBody>
      {items.map((item, index) => (
        <ItemRow key={index} item={item} showEaters={showEaters} />
      ))}
      <SummaryRow
        label="Subtotal"
        amount={summary.subTotal}
        variant="emphasis"
      />
      <SummaryRow
        label={`Tax${summary.taxPercentage ? ` (${summary.taxPercentage.toFixed(2)}%)` : ""}`}
        amount={summary.taxAmount}
        variant="muted"
      />
      <SummaryRow
        label={`Tip${summary.tipPercentage ? ` (${summary.tipPercentage.toFixed(2)}%)` : ""}`}
        amount={summary.tipAmount}
        variant="muted"
      />
      <SummaryRow label="Total" amount={summary.total} variant="bold" />
    </TableBody>
  </Table>
)

interface SplitDisplayProps {
  splitResult: SplitSchema
}

export const SplitDisplay: React.FC<SplitDisplayProps> = ({ splitResult }) => (
  <Card>
    <CardHeader className="pb-0">
      <CardTitle className="mb-1.5">
        {splitResult.checkName} - Check Split
      </CardTitle>
      <div className="flex flex-wrap gap-2">
        {splitResult.eaters.map((eater) => (
          <Badge key={eater.name} variant="secondary" className="text-sm">
            {eater.name}: ${Math.ceil(eater.total)}
          </Badge>
        ))}
      </div>
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
