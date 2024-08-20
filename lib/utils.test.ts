import { logZodErrors, getURLArgs, calculateSplit } from "@/lib/utils"
import { formSchema, FormSchema, splitSchema } from "@/lib/schemas"
import exampleChecks from "@/public/exampleChecks.json"

describe("getURLArgs", () => {
  it("should create a correctly formatted and encoded URL", () => {
    const testData: FormSchema = exampleChecks.joesDinner

    const parseData = formSchema.safeParse(testData)
    if (!parseData.success) {
      logZodErrors(parseData.error, "FormSchema")
    }
    expect(parseData.success).toBe(true)

    if (parseData.success) {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || ""
      const result = getURLArgs(testData)[0]

      expect(result.startsWith(baseUrl)).toBe(true)

      console.log(result)

      const url = new URL(result)
      const params = new URLSearchParams(url.search)

      expect(params.get("checkName")).toBe("Dinner at Joes")
      expect(params.get("taxAmount")).toBe("5")
      expect(params.get("tipBeforeTax")).toBe("true")
      expect(params.get("tipAmount")).toBe("10")

      const decodedItems = JSON.parse(params.get("items") || "[]")
      expect(decodedItems).toEqual(testData.items)

      const decodedEaters = JSON.parse(params.get("eaters") || "[]")
      expect(decodedEaters).toEqual(testData.eaters)

      expect(result).not.toContain("[")
      expect(result).not.toContain("]")
      expect(result).toContain("%5B") // encoded '['
      expect(result).toContain("%5D") // encoded ']'
    }
  })

  it("just log it", () => {
    const input: FormSchema = exampleChecks.wings

    const parseData = formSchema.safeParse(input)
    if (!parseData.success) {
      logZodErrors(parseData.error, "FormSchema")
    }
    expect(parseData.success).toBe(true)

    if (parseData.success) {
      const result = getURLArgs(input)

      console.log(result[0])
    }
  })
})

describe("calculateSplit", () => {
  it("should accept valid input and produce correctly formatted output", () => {
    const inputData = exampleChecks.joesDinner

    const parseResult = formSchema.safeParse(inputData)
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
    const input = exampleChecks.wings

    const parseResult = formSchema.safeParse(input)
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
        expect(split.checkName).toBe(input.checkName)
        expect(split.taxPercentage).toBeCloseTo(7, 1)
        expect(split.taxAmount).toBe(input.taxAmount)
        expect(split.tipPercentage).toBeGreaterThanOrEqual(15)
        expect(split.tipPercentage).toBeLessThanOrEqual(20)
        expect(split.tipAmount).toBe(input.tipAmount)

        const eatersByName = split.eaters.reduce(
          (acc, eater) => {
            acc[eater.name] = eater
            return acc
          },
          {} as Record<string, (typeof split.eaters)[0]>
        )

        const [karen, samuel, adam, vincent, kyle] = [
          "Karen",
          "Samuel",
          "Adam",
          "Vincent",
          "Kyle"
        ].map((name) => split.eaters.find((e) => e.name === name)!)

        expect(karen.total).toBeLessThan(20)
        expect(adam.total).toBeCloseTo(kyle.total)
        expect(samuel.total).toBeCloseTo(vincent.total)
        expect(samuel.total).toBeLessThan(adam.total)
      }
    }
  })
})
