import { logZodErrors, createSplitURL, calculateSplit } from "@/lib/utils"
import { formSchema, FormSchema, splitSchema } from "@/lib/schemas"

describe("createSplitURL", () => {
  it("should create a correctly formatted and encoded URL", () => {
    const testData: FormSchema = {
      checkName: "Dinner at Joes",
      taxAmount: 5.0,
      tipBeforeTax: true,
      tipAmount: 10.0,
      items: [
        {
          name: "Pizza",
          price: 20.0,
          eaters: [{ name: "Alice" }, { name: "Bob" }]
        },
        { name: "Salad", price: 10.0, eaters: [{ name: "Charlie" }] }
      ],
      eaters: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]
    }

    const parseData = formSchema.safeParse(testData)
    if (!parseData.success) {
      logZodErrors(parseData.error, "FormSchema")
    }
    expect(parseData.success).toBe(true)

    if (parseData.success) {
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || ""
      const result = createSplitURL(testData)[0]

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
    const input: FormSchema = {
      checkName: "Wings Order",
      taxAmount: 7.46,
      tipAmount: 19.16,
      tipBeforeTax: true,
      items: [
        {
          name: "Large French Fries",
          price: 7.49,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        },
        {
          name: "30 Traditional Wings",
          price: 40.99,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        },
        {
          name: "10 Traditional Wings",
          price: 15.99,
          eaters: [{ name: "Karen" }]
        },
        {
          name: "Michelob Ultra (2x)",
          price: 13.5,
          eaters: [{ name: "Adam" }, { name: "Kyle" }]
        },
        {
          name: "20 Traditional Wings",
          price: 28.49,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        }
      ],
      eaters: [
        { name: "Vincent" },
        { name: "Karen" },
        { name: "Samuel" },
        { name: "Adam" },
        { name: "Kyle" }
      ]
    }

    const parseData = formSchema.safeParse(input)
    if (!parseData.success) {
      logZodErrors(parseData.error, "FormSchema")
    }
    expect(parseData.success).toBe(true)

    if (parseData.success) {
      const result = createSplitURL(input)

      console.log(result[0])
    }
  })
})

describe("calculateSplit", () => {
  it("should accept valid input and produce correctly formatted output", () => {
    const inputData = {
      checkName: "Dinner at Joe's",
      taxAmount: 5.0,
      tipBeforeTax: true,
      tipAmount: 10.0,
      items: [
        {
          name: "Pizza",
          price: 20.0,
          eaters: [{ name: "Alice" }, { name: "Bob" }]
        },
        { name: "Salad", price: 10.0, eaters: [{ name: "Charlie" }] }
      ],
      eaters: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]
    }

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
    const input = {
      checkName: "Wings Order",
      taxAmount: 7.46,
      tipAmount: 19.16,
      tipBeforeTax: true,
      items: [
        {
          name: "Large French Fries",
          price: 7.49,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        },
        {
          name: "30 Traditional Wings",
          price: 40.99,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        },
        {
          name: "10 Traditional Wings",
          price: 15.99,
          eaters: [{ name: "Karen" }]
        },
        {
          name: "Michelob Ultra (2x)",
          price: 13.5,
          eaters: [{ name: "Adam" }, { name: "Kyle" }]
        },
        {
          name: "20 Traditional Wings",
          price: 28.49,
          eaters: [
            { name: "Vincent" },
            { name: "Kyle" },
            { name: "Samuel" },
            { name: "Adam" }
          ]
        }
      ],
      eaters: [
        { name: "Vincent" },
        { name: "Karen" },
        { name: "Samuel" },
        { name: "Adam" },
        { name: "Kyle" }
      ]
    }

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
