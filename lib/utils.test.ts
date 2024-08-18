import { logZodErrors, createSplitURL } from "@/lib/utils"
import { formSchema, FormSchema } from "@/lib/schemas"

describe("createSplitURL", () => {
  it("should create a correctly formatted and encoded URL", () => {
    const testData: FormSchema = {
      checkName: "Dinner at Joe's",
      taxAmount: 5.0,
      tipBeforeTax: true,
      tipAmount: 10.0,
      items: [
        {
          name: "Pizza",
          price: 20.0,
          eaters: ["Alice", "Bob"]
        },
        { name: "Salad", price: 10.0, eaters: ["Charlie"] }
      ],
      eaters: ["Alice", "Bob", "Charlie"]
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

      expect(params.get("checkName")).toBe("Dinner at Joe's")
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
          eaters: ["Vincent", "Kyle", "Samuel", "Adam"]
        },
        {
          name: "30 Traditional Wings",
          price: 40.99,
          eaters: ["Vincent", "Kyle", "Samuel", "Adam"]
        },
        {
          name: "10 Traditional Wings",
          price: 15.99,
          eaters: ["Karen"]
        },
        {
          name: "Michelob Ultra (2x)",
          price: 13.5,
          eaters: ["Adam", "Kyle"]
        },
        {
          name: "20 Traditional Wings",
          price: 28.49,
          eaters: ["Vincent", "Kyle", "Samuel", "Adam"]
        }
      ],
      eaters: ["Vincent", "Karen", "Samuel", "Adam", "Kyle"]
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
