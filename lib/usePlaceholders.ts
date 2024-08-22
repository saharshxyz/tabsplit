import { useState, useCallback, useMemo } from "react"
import { faker } from "@faker-js/faker"
import { TabSchema } from "@/lib/schemas"
import { generateExampleTab } from "@/lib/utils"

export interface Placeholder {
  tabName: string
  taxAmount: string
  tipAmount: string
  splitterName: string
  itemName: string
  itemPrice: string
}

export function usePlaceholders() {
  const [exampleTab, setExampleTab] = useState<TabSchema>(generateExampleTab())

  const randomPlaceholders = useMemo<Placeholder>(() => {
    return {
      tabName: exampleTab.tabName,
      taxAmount: exampleTab.taxAmount.toFixed(2),
      tipAmount: exampleTab.tipAmount.toFixed(2),
      splitterName: exampleTab.splitters[0]?.name || "",
      itemName: exampleTab.items[0]?.name || "",
      itemPrice: exampleTab.items[0]?.price.toFixed(2) || ""
    }
  }, [exampleTab])

  const generateNewExampleTab = useCallback(() => {
    setExampleTab(generateExampleTab())
  }, [])

  const appendSplitterPlaceholder = useCallback(() => {
    setExampleTab((prev) => ({
      ...prev,
      splitters: [...prev.splitters, { name: faker.person.firstName() }]
    }))
  }, [])

  const appendItemPlaceholder = useCallback(() => {
    setExampleTab((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price({ min: 5, max: 70, dec: 2 })),
          splitters: faker.helpers
            .shuffle([...prev.splitters])
            .slice(0, faker.number.int({ min: 1, max: prev.splitters.length }))
        }
      ]
    }))
  }, [])

  return {
    randomPlaceholders,
    splitterPlaceholders: exampleTab.splitters,
    itemPlaceholders: exampleTab.items,
    appendSplitterPlaceholder,
    appendItemPlaceholder,
    generateNewExampleTab
  }
}
