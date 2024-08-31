import {
  logZodErrors,
  getURLArgs,
  calculateSplit,
  transformPartialToFullTab
} from "@/lib/utils"
import {
  tabSchema,
  TabSchema,
  splitSchema,
  partialTabSchema,
  PartialTabSchema
} from "@/lib/schemas"
import exampleTabs from "@/public/exampleTabs.json"

describe("getURLArgs", () => {
  it("should create a correctly formatted and encoded URL", () => {
    const testData: TabSchema = exampleTabs.joesDinner as TabSchema

    const parseData = tabSchema.safeParse(testData)
    if (!parseData.success) {
      logZodErrors(parseData.error, "FormSchema")
    }
    expect(parseData.success).toBe(true)

    if (parseData.success) {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || ""
      const [resultBaseUrl, encodedParams] = getURLArgs(testData, baseUrl)

      expect(resultBaseUrl).toBe(baseUrl)

      const params = new URLSearchParams(encodedParams)

      expect(params.get("tabName")).toBe("Dinner at Joes")
      expect(params.get("taxAmount")).toBe("5")
      expect(params.get("tipBeforeTax")).toBe("true")
      expect(params.get("tipAmount")).toBe("10")

      const decodedItems = JSON.parse(params.get("items") || "[]")
      expect(decodedItems).toEqual(testData.items)

      const decodedSplitters = JSON.parse(params.get("splitters") || "[]")
      expect(decodedSplitters).toEqual(testData.splitters)

      expect(encodedParams).not.toContain("[")
      expect(encodedParams).not.toContain("]")
      expect(encodedParams).toContain("%5B") // encoded '['
      expect(encodedParams).toContain("%5D") // encoded ']'
    }
  })
})

describe("calculateSplit", () => {
  it("should accept valid input and produce correctly formatted output", () => {
    const inputData = exampleTabs.joesDinner

    const parseResult = tabSchema.safeParse(inputData)
    if (!parseResult.success) {
      logZodErrors(parseResult.error, "FormSchema")
    }
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const result = calculateSplit(parseResult.data)

      const splitParseResult = splitSchema.safeParse(result)
      if (!splitParseResult.success) {
        logZodErrors(splitParseResult.error, "SplitSchema")
      }
      expect(splitParseResult.success).toBe(true)
    }
  })

  it("should correctly calculate the split for a given order", () => {
    const input = exampleTabs.wings

    const parseResult = tabSchema.safeParse(input)
    if (!parseResult.success) {
      logZodErrors(parseResult.error, "FormSchema")
    }
    expect(parseResult.success).toBe(true)

    if (parseResult.success) {
      const split = calculateSplit(parseResult.data)

      const splitParseResult = splitSchema.safeParse(split)
      if (!splitParseResult.success) {
        logZodErrors(splitParseResult.error, "SplitSchema")
      }
      expect(splitParseResult.success).toBe(true)

      if (splitParseResult.success) {
        expect(split.tabName).toBe(input.tabName)
        expect(split.taxPercentage).toBeCloseTo(7, 1)
        expect(split.taxAmount).toBe(input.taxAmount)
        expect(split.tipPercentage).toBeGreaterThanOrEqual(15)
        expect(split.tipPercentage).toBeLessThanOrEqual(20)
        expect(split.tipAmount).toBe(input.tipAmount)

        const splittersByName = split.splitters.reduce(
          (acc, splitter) => {
            acc[splitter.name] = splitter
            return acc
          },
          {} as Record<string, (typeof split.splitters)[0]>
        )

        const [karen, samuel, adam, vincent, kyle] = [
          "Karen",
          "Samuel",
          "Adam",
          "Vincent",
          "Kyle"
        ].map((name) => split.splitters.find((e) => e.name === name)!)

        expect(karen.total).toBeLessThan(20)
        expect(adam.total).toBeCloseTo(kyle.total)
        expect(samuel.total).toBeCloseTo(vincent.total)
        expect(samuel.total).toBeLessThan(adam.total)
      }
    }
  })
})

describe("transformPartialToFullTab and getURLArgs", () => {
  const baseUrl = "https://example.com"

  const testTransformAndUrlArgs = (
    partialTab: PartialTabSchema,
    additionalChecks: (fullTab: TabSchema, params: URLSearchParams) => void
  ) => {
    const fullTab = transformPartialToFullTab(partialTab)

    const parseResult = tabSchema.safeParse(fullTab)
    expect(parseResult.success).toBe(false) // Transformed should match TabSchema type, but not satisfy the schema since there aren't any splitters, and tabSchema requires splitters

    const [resultBaseUrl, encodedParams] = getURLArgs(fullTab, baseUrl)
    expect(resultBaseUrl).toBe(baseUrl)

    const params = new URLSearchParams(encodedParams)

    // Common checks
    expect(params.get("tabName")).toBe(partialTab.tabName)
    expect(params.get("taxAmount")).toBe(partialTab.taxAmount.toString())
    expect(params.get("tipAmount")).toBe(partialTab.tipAmount.toString())
    expect(params.get("tipBeforeTax")).toBe("true")

    const decodedItems = JSON.parse(params.get("items") || "[]")
    expect(decodedItems).toEqual(fullTab.items)

    const decodedSplitters = JSON.parse(params.get("splitters") || "[]")
    expect(decodedSplitters).toEqual([])

    expect(encodedParams).not.toContain("[")
    expect(encodedParams).not.toContain("]")
    expect(encodedParams).toContain("%5B") // encoded '['
    expect(encodedParams).toContain("%5D") // encoded ']'

    // Run additional checks specific to each test case
    additionalChecks(fullTab, params)
  }

  it("should transform a standard partial tab correctly", () => {
    const validPartialTab: PartialTabSchema = {
      tabName: "Test Lunch",
      taxAmount: 5.5,
      tipAmount: 10.0,
      items: [
        { name: "Burger", price: 12.99 },
        { name: "Fries", price: 3.99 },
        { name: "Soda", price: 2.5 }
      ]
    }

    testTransformAndUrlArgs(validPartialTab, (fullTab, params) => {
      expect(fullTab.items).toHaveLength(3)
      expect(fullTab.items.every((item) => item.splitters.length === 0)).toBe(
        true
      )
    })
  })

  it("should handle a partial tab with minimum required fields", () => {
    const minimalPartialTab: PartialTabSchema = {
      tabName: "Minimal Tab",
      taxAmount: 1,
      tipAmount: 1,
      items: [{ name: "Item", price: 10 }]
    }

    testTransformAndUrlArgs(minimalPartialTab, (fullTab, params) => {
      expect(fullTab.items).toHaveLength(1)
      expect(fullTab.items[0]).toEqual({
        name: "Item",
        price: 10,
        splitters: []
      })
    })
  })

  it("should preserve decimal places in amounts", () => {
    const precisePartialTab: PartialTabSchema = {
      tabName: "Precise Tab",
      taxAmount: 1.23,
      tipAmount: 4.56,
      items: [{ name: "Precise Item", price: 10.99 }]
    }

    testTransformAndUrlArgs(precisePartialTab, (fullTab, params) => {
      expect(params.get("taxAmount")).toBe("1.23")
      expect(params.get("tipAmount")).toBe("4.56")
      expect(fullTab.items[0].price).toBe(10.99)
    })
  })

  it("should handle a partial tab with multiple items", () => {
    const multiItemPartialTab: PartialTabSchema = {
      tabName: "Multi-Item Tab",
      taxAmount: 2,
      tipAmount: 3,
      items: [
        { name: "Item 1", price: 10 },
        { name: "Item 2", price: 20 },
        { name: "Item 3", price: 30 }
      ]
    }

    testTransformAndUrlArgs(multiItemPartialTab, (fullTab, params) => {
      expect(fullTab.items).toHaveLength(3)
      expect(fullTab.items.every((item) => item.splitters.length === 0)).toBe(
        true
      )
    })

    // console.log(
    //   getURLArgs(transformPartialToFullTab(multiItemPartialTab)).join("#")
    // )
  })
})
