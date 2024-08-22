import { logZodErrors, getURLArgs, calculateSplit } from "@/lib/utils"
import { tabSchema, TabSchema, splitSchema } from "@/lib/schemas"
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
