import chroma from "chroma-js"
import * as React from "react"
import { Label, LabelList, Pie, PieChart } from "recharts"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from "src/components/ui/chart"
import type { SplitSchema } from "src/lib/schemas"
import { shuffleArray } from "src/lib/utils"

interface chartData {
	name: string
	dollar: number
	fill: string
}

const getCharts = (
	data: SplitSchema
): {
	itemData: chartData[]
	splitterData: chartData[]
	config: ChartConfig
} => {
	function generateGrayscaleColors(count: number) {
		const white = "#E6E5E5"
		const black = "#414144"
		return chroma
			.bezier([white, "gray", black])
			.scale()
			.mode("lab")
			.colors(count)
	}

	const config: ChartConfig = {
		dollar: { label: "Cost" },
		portion: { label: "Portion" }
	}

	const itemData: chartData[] = []
	const splitterData: chartData[] = []
	const itemColors = generateGrayscaleColors(data.items.length + 2) // +2 for tax and tip
	const splitterColors = generateGrayscaleColors(data.splitters.length)

	itemData.push(
		{
			name: "Tax",
			dollar: data.taxAmount,
			fill: itemColors[0]
		},
		{
			name: "Tip",
			dollar: data.tipAmount,
			fill: itemColors[1]
		}
	)

	data.items.forEach((item, i) =>
		itemData.push({
			name: item.name,
			dollar: Math.round(item.price * 100) / 100,
			fill: itemColors[i + 2]
		})
	)

	data.splitters.forEach((splitter, i) => {
		splitterData.push({
			name: splitter.name,
			dollar: Math.round(splitter.total * 100) / 100,
			fill: splitterColors[i]
		})
	})

	itemData.concat(splitterData).forEach((element: chartData) => {
		config[element.name] = { label: element.name, color: element.fill }
	})

	return {
		itemData: shuffleArray(itemData),
		splitterData: shuffleArray(splitterData),
		config
	}
}

interface SplitChartsProps {
	splitResult: SplitSchema
}

export const SplitCharts: React.FC<SplitChartsProps> = ({ splitResult }) => {
	const { itemData, splitterData, config } = getCharts(splitResult)

	const total = React.useMemo(() => {
		return itemData.reduce((acc, curr) => acc + curr.dollar, 0)
	}, [itemData])

	return (
		<>
			<div className="hidden pb-3 pt-6 sm:flex">
				<ChartContainer
					config={config}
					className="aspect-[4/3] min-h-[50%] w-full max-w-[50%]"
				>
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									nameKey="name"
									indicator="line"
									labelFormatter={(_, payload) => {
										return (
											config[payload?.[0].name as keyof typeof config]?.label ||
											""
										)
									}}
								/>
							}
						/>

						<Pie
							data={itemData}
							dataKey="dollar"
							nameKey="name"
							innerRadius={total < 100 ? 50 : total < 1000 ? 60 : 63.5}
							outerRadius={95}
							strokeWidth={5}
							paddingAngle={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="central"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
													dominantBaseline="central"
												>
													${total.toFixed(0)}
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
				<ChartContainer
					config={config}
					className="aspect-[4/3] min-h-[50%] w-full max-w-[50%] [&_.recharts-pie-label-line]:stroke-foreground"
				>
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									nameKey="name"
									indicator="line"
									labelFormatter={(_, payload) => {
										return (
											config[payload?.[0].name as keyof typeof config]?.label ||
											""
										)
									}}
								/>
							}
						/>

						<Pie
							data={splitterData}
							dataKey="dollar"
							nameKey="name"
							innerRadius={80}
							outerRadius={95}
							strokeWidth={5}
							paddingAngle={5}
						>
							<LabelList
								dataKey="name"
								position="outside"
								offset={10}
								className="fill-foreground"
								stroke="none"
								fontSize={12}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</div>

			<div className="pb-3 pt-6 sm:hidden">
				<ChartContainer
					config={config}
					className="aspect-[4/3] min-h-[50%] w-full"
				>
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									nameKey="name"
									indicator="line"
									labelFormatter={(_, payload) => {
										return (
											config[payload?.[0].name as keyof typeof config]?.label ||
											""
										)
									}}
								/>
							}
						/>

						<Pie
							data={itemData}
							dataKey="dollar"
							nameKey="name"
							innerRadius={total < 100 ? 50 : total < 1000 ? 60 : 63.5}
							outerRadius={70}
							strokeWidth={5}
							paddingAngle={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="central"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
													dominantBaseline="central"
												>
													${total.toFixed(0)}
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
						<Pie
							data={splitterData}
							dataKey="dollar"
							nameKey="name"
							innerRadius={80}
							outerRadius={95}
							strokeWidth={5}
							paddingAngle={5}
						>
							<LabelList
								dataKey="name"
								position="outside"
								offset={10}
								className="fill-foreground"
								stroke="none"
								fontSize={12}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</div>
		</>
	)
}
