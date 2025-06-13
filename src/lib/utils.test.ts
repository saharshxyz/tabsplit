import { describe, expect, it } from "vitest"
import { type TabSchema, tabSchema } from "./schemas"
import { calculateSplit } from "./utils"

// Reusable test data for a typical scenario
const createMockTabData = (): TabSchema => ({
	tabName: "Dinner at The Code Bistro",
	tabDescription: { type: "None" },
	taxAmount: 8.0,
	tipBeforeTax: true,
	tipAmount: 20.0,
	items: [
		{
			name: "Pizza",
			price: 25.0,
			splitters: [{ name: "Alice" }, { name: "Bob" }]
		},
		{ name: "Salad", price: 15.0, splitters: [{ name: "Alice" }] },
		{ name: "Beer", price: 8.0, splitters: [{ name: "Bob" }] },
		{ name: "Wine", price: 12.0, splitters: [{ name: "Charlie" }] }
	],
	splitters: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]
})

describe("calculateSplit", () => {
	it("should correctly calculate the split with tip calculated BEFORE tax", () => {
		const data = createMockTabData()
		const result = calculateSplit(data)

		const subTotal = 25.0 + 15.0 + 8.0 + 12.0 // 60
		const taxRate = 8.0 / subTotal // 0.1333...
		const tipRate = 20.0 / subTotal // 0.3333...

		// Expected values for Alice
		const aliceSubtotal = 25.0 / 2 + 15.0 // 12.5 + 15 = 27.5
		const aliceTax = aliceSubtotal * taxRate
		const aliceTip = aliceSubtotal * tipRate
		const aliceTotal = aliceSubtotal + aliceTax + aliceTip

		// Expected values for Bob
		const bobSubtotal = 25.0 / 2 + 8.0 // 12.5 + 8 = 20.5
		const bobTax = bobSubtotal * taxRate
		const bobTip = bobSubtotal * tipRate
		const bobTotal = bobSubtotal + bobTax + bobTip

		// Expected values for Charlie
		const charlieSubtotal = 12.0
		const charlieTax = charlieSubtotal * taxRate
		const charlieTip = charlieSubtotal * tipRate
		const charlieTotal = charlieSubtotal + charlieTax + charlieTip

		// --- Assertions ---

		// Overall Totals
		expect(result.subTotal).toBe(subTotal)
		expect(result.taxAmount).toBe(8.0)
		expect(result.tipAmount).toBe(20.0)
		expect(result.total).toBe(subTotal + 8.0 + 20.0)
		expect(result.taxPercentage).toBeCloseTo(taxRate * 100)
		expect(result.tipPercentage).toBeCloseTo(tipRate * 100)

		// Splitters array should be sorted by name
		expect(result.splitters.map((s) => s.name)).toEqual([
			"Alice",
			"Bob",
			"Charlie"
		])

		// Alice's Split
		const aliceResult = result.splitters.find((s) => s.name === "Alice")!
		expect(aliceResult.subtotal).toBeCloseTo(aliceSubtotal)
		expect(aliceResult.taxAmount).toBeCloseTo(aliceTax)
		expect(aliceResult.tipAmount).toBeCloseTo(aliceTip)
		expect(aliceResult.total).toBeCloseTo(aliceTotal)
		expect(aliceResult.items.map((i) => i.name).sort()).toEqual([
			"Pizza",
			"Salad"
		])

		// Bob's Split
		const bobResult = result.splitters.find((s) => s.name === "Bob")!
		expect(bobResult.subtotal).toBeCloseTo(bobSubtotal)
		expect(bobResult.taxAmount).toBeCloseTo(bobTax)
		expect(bobResult.tipAmount).toBeCloseTo(bobTip)
		expect(bobResult.total).toBeCloseTo(bobTotal)

		// Charlie's Split
		const charlieResult = result.splitters.find((s) => s.name === "Charlie")!
		expect(charlieResult.subtotal).toBeCloseTo(charlieSubtotal)
		expect(charlieResult.taxAmount).toBeCloseTo(charlieTax)
		expect(charlieResult.tipAmount).toBeCloseTo(charlieTip)
		expect(charlieResult.total).toBeCloseTo(charlieTotal)
	})

	it("should correctly calculate the split with tip calculated AFTER tax", () => {
		const data = createMockTabData()
		data.tipBeforeTax = false
		const result = calculateSplit(data)

		const subTotal = 60.0
		const taxAmount = 8.0
		const tipBaseAmount = subTotal + taxAmount // 68
		const taxRate = taxAmount / subTotal // 0.1333...
		const tipRate = data.tipAmount / tipBaseAmount // 20 / 68 = 0.2941...

		// Alice's calculations
		const aliceSubtotal = 27.5
		const aliceTax = aliceSubtotal * taxRate
		const aliceTipBase = aliceSubtotal + aliceTax
		const aliceTip = aliceTipBase * tipRate

		expect(result.tipBeforeTax).toBe(false)

		const aliceResult = result.splitters.find((s) => s.name === "Alice")!
		expect(aliceResult.subtotal).toBeCloseTo(aliceSubtotal)
		expect(aliceResult.taxAmount).toBeCloseTo(aliceTax)
		expect(aliceResult.tipAmount).toBeCloseTo(aliceTip)
		expect(aliceResult.total).toBeCloseTo(aliceSubtotal + aliceTax + aliceTip)
	})

	it("should handle a subtotal of zero to prevent division by zero", () => {
		const data = createMockTabData()
		data.items = [
			{ name: "Free Water", price: 0, splitters: [{ name: "Alice" }] }
		]
		data.splitters = [{ name: "Alice" }]
		data.taxAmount = 5
		data.tipAmount = 10

		const result = calculateSplit(data)

		expect(result.subTotal).toBe(0)
		expect(result.total).toBe(0)
		expect(result.taxAmount).toBe(0)
		expect(result.tipAmount).toBe(0)
		expect(result.taxPercentage).toBe(0)
		expect(result.tipPercentage).toBe(0)

		const aliceResult = result.splitters[0]
		expect(aliceResult.name).toBe("Alice")
		expect(aliceResult.subtotal).toBe(0)
		expect(aliceResult.taxAmount).toBe(0)
		expect(aliceResult.tipAmount).toBe(0)
		expect(aliceResult.total).toBe(0)
		expect(aliceResult.items).toEqual([])
	})

	it("should handle zero tax and zero tip", () => {
		const data = createMockTabData()
		data.taxAmount = 0
		data.tipAmount = 0
		const result = calculateSplit(data)

		const subTotal = 60
		expect(result.subTotal).toBe(subTotal)
		expect(result.total).toBe(subTotal)
		expect(result.taxAmount).toBe(0)
		expect(result.tipAmount).toBe(0)
		expect(result.taxPercentage).toBe(0)
		expect(result.tipPercentage).toBe(0)

		const aliceResult = result.splitters.find((s) => s.name === "Alice")!
		expect(aliceResult.subtotal).toBe(27.5)
		expect(aliceResult.taxAmount).toBe(0)
		expect(aliceResult.tipAmount).toBe(0)
		expect(aliceResult.total).toBe(27.5)
	})

	it("should correctly sort items and splitters in the final output", () => {
		const data: TabSchema = {
			tabName: "Unsorted Dinner",
			tabDescription: { type: "None" },
			taxAmount: 5,
			tipAmount: 10,
			tipBeforeTax: true,
			items: [
				{ name: "Zucchini Sticks", price: 10, splitters: [{ name: "Zane" }] },
				{ name: "Apple Pie", price: 8, splitters: [{ name: "Abby" }] }
			],
			splitters: [{ name: "Zane" }, { name: "Abby" }]
		}

		const result = calculateSplit(data)

		// Check top-level items array
		expect(result.items.map((i) => i.name)).toEqual([
			"Apple Pie",
			"Zucchini Sticks"
		])
		// Check splitters array
		expect(result.splitters.map((s) => s.name)).toEqual(["Abby", "Zane"])
	})
})

describe("tabSchema", () => {
	it("should succeed with valid data", () => {
		const validData = createMockTabData()
		const result = tabSchema.safeParse(validData)
		expect(result.success).toBe(true)
	})

	it("should fail if an item splitter is not in the main splitters list", () => {
		const invalidData = createMockTabData()
		// 'Dave' is splitting an item but is not in the top-level splitters array
		invalidData.items.push({
			name: "Extra Item",
			price: 10,
			splitters: [{ name: "Dave" }]
		})
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Every person splitting an item must be in the main 'splitters' list."
			)
			expect(result.error.issues[0].path).toEqual(["items"])
		}
	})

	it("should fail if a splitter in the main list is not assigned to any item", () => {
		const invalidData = createMockTabData()
		// 'Dave' is in the main splitters array but is not on any item
		invalidData.splitters.push({ name: "Dave" })
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				"Every person in the 'splitters' list must be assigned to at least one item."
			)
			expect(result.error.issues[0].path).toEqual(["splitters"])
		}
	})

	it("should fail if the items array is empty", () => {
		const invalidData = createMockTabData()
		invalidData.items = []
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].path).toEqual(["items"])
		}
	})

	it("should fail if the splitters array is empty", () => {
		const invalidData = createMockTabData()
		invalidData.splitters = []
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].path).toEqual(["splitters"])
		}
	})

	it("should fail if item names are not unique", () => {
		const invalidData = createMockTabData()
		invalidData.items.push({
			name: "Salad",
			price: 5,
			splitters: [{ name: "Bob" }]
		})
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Names must be unique")
			expect(result.error.issues[0].path).toEqual(["items"])
		}
	})

	it("should fail if splitter names are not unique", () => {
		const invalidData = createMockTabData()
		invalidData.splitters.push({ name: "Alice" })
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Names must be unique")
			expect(result.error.issues[0].path).toEqual(["splitters"])
		}
	})

	it("should fail if an item's splitter array is empty", () => {
		const invalidData = createMockTabData()
		invalidData.items[0].splitters = []
		const result = tabSchema.safeParse(invalidData)
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.error.issues[0].path).toEqual(["items", 0, "splitters"])
		}
	})
})
