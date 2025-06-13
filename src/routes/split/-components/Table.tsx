import { User, Users } from "lucide-react"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "src/components/ui/table"

interface ItemRowProps {
	item: {
		name: string
		price?: number
		portionCost?: number
		splitters?: { name: string }[]
	}
	showSplitters?: boolean
}

const ItemRow: React.FC<ItemRowProps> = ({ item, showSplitters = false }) => (
	<TableRow className="w-full border-0 leading-tight">
		<TableCell className={`${showSplitters ? "w-3/12" : "w-full"} py-2 pr-1.5`}>
			{item.name}
		</TableCell>
		<TableCell className={`${showSplitters ? "w-full" : ""} py-2 text-right`}>
			{showSplitters && item.splitters && (
				<div className="flex items-center justify-end">
					{item.splitters.length > 1 ? (
						<Users className="mr-2 hidden sm:inline-block" />
					) : (
						<User className="mr-2 hidden sm:inline-block" />
					)}
					<p>{item.splitters.map((splitter) => splitter.name).join(", ")}</p>
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
	showSplitters?: boolean
	summary: {
		subTotal: number
		taxPercentage: number | undefined
		taxAmount: number
		tipPercentage: number | undefined
		tipAmount: number
		total: number
	}
}

export const SplitTable: React.FC<SplitTableProps> = ({
	items,
	showSplitters = false,
	summary
}) => (
	<Table>
		{showSplitters && (
			<TableHeader>
				<TableRow>
					<TableHead>Item</TableHead>
					<TableHead className="w-full text-right">Splitters</TableHead>
					<TableHead className="w-24 text-right">Price</TableHead>
				</TableRow>
			</TableHeader>
		)}
		<TableBody>
			{items.map((item) => (
				<ItemRow key={item.name} item={item} showSplitters={showSplitters} />
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
