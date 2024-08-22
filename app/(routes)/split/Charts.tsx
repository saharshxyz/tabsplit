"use client"

import * as React from "react"
import { Label, LabelList, Pie, PieChart } from "recharts"
import chroma from "chroma-js"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

import { SplitSchema } from "@/lib/schemas"

interface chartData {
  name: string
  dollar: number
  fill: string
}

const getCharts = (
  data: SplitSchema
): {
  itemData: chartData[]
  eaterData: chartData[]
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

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  let config: ChartConfig = {
    dollar: {
      label: "Cost"
    },
    portion: {
      label: "Portion"
    }
  }

  const itemData: chartData[] = []
  const eaterData: chartData[] = []
  const itemColors = generateGrayscaleColors(data.items.length + 2) // +2 for tax and tip
  const eaterColors = generateGrayscaleColors(data.eaters.length)

  itemData.push({
    name: "Tax",
    dollar: data.taxAmount,
    fill: itemColors[0]
  })

  itemData.push({
    name: "Tip",
    dollar: data.tipAmount,
    fill: itemColors[1]
  })

  // Math.round is for rounding to hundreths while still returning a Number
  data.items.forEach((item, i) =>
    itemData.push({
      name: item.name,
      dollar: Math.round(item.price * 100) / 100,
      fill: itemColors[i + 2]
    })
  )

  data.eaters.forEach((eater, i) => {
    eaterData.push({
      name: eater.name,
      dollar: Math.round(eater.total * 100) / 100,
      fill: eaterColors[i]
    })
  })

  itemData.concat(eaterData).forEach((element: chartData) => {
    config[element.name] = {
      label: element.name,
      color: element.fill
    }
  })

  return {
    itemData: shuffleArray(itemData),
    eaterData: shuffleArray(eaterData),
    config
  }
}

interface SplitChartsProps {
  splitResult: SplitSchema
}

export const SplitCharts: React.FC<SplitChartsProps> = ({ splitResult }) => {
  const { itemData, eaterData, config } = getCharts(splitResult)

  const total = React.useMemo(() => {
    return itemData.reduce((acc, curr) => acc + curr.dollar, 0)
  }, [itemData])

  return (
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
            paddingAngle={3}
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
            data={eaterData}
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
  )
}
