import { type ClassValue, clsx } from "clsx"
import type { SplitSchema, TabSchema } from "src/lib/schemas"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const calculateSplit = (data: TabSchema): SplitSchema => {
	const byName = <T extends { name: string }>(a: T, b: T) =>
		a.name.localeCompare(b.name)

	const {
		tabName,
		tabDescription,
		taxAmount,
		tipBeforeTax,
		tipAmount,
		items,
		splitters: formSplitters
	} = data

	const subTotal = items.reduce((acc, item) => acc + item.price, 0)

	// Guard clause for division-by-zero, returns a zeroed-out split.
	if (subTotal === 0) {
		return {
			tabName,
			tabDescription,
			taxPercentage: 0,
			taxAmount: 0,
			tipBeforeTax,
			tipPercentage: 0,
			tipAmount: 0,
			subTotal: 0,
			total: 0,
			items: [...items].sort(byName),
			splitters: formSplitters
				.map(({ name }) => ({
					name,
					items: [],
					subtotal: 0,
					taxAmount: 0,
					tipAmount: 0,
					total: 0
				}))
				.sort(byName)
		}
	}

	const taxRate = taxAmount / subTotal
	const tipBaseAmount = tipBeforeTax ? subTotal : subTotal + taxAmount
	const tipRate = tipAmount / tipBaseAmount

	// Aggregate each person's subtotal and item portions in one pass.
	const splitterDetails = new Map<
		string,
		{ subtotal: number; items: { name: string; portionCost: number }[] }
	>()

	for (const item of items) {
		const portionCost = item.price / item.splitters.length
		for (const splitter of item.splitters) {
			if (!splitterDetails.has(splitter.name))
				splitterDetails.set(splitter.name, { subtotal: 0, items: [] })

			const details = splitterDetails.get(splitter.name)!
			details.subtotal += portionCost
			details.items.push({ name: item.name, portionCost })
		}
	}

	const splitters = formSplitters
		.map(({ name }) => {
			const { subtotal, items: personItems } = splitterDetails.get(name) || {
				subtotal: 0,
				items: []
			}

			const personTax = subtotal * taxRate
			const tipBase = tipBeforeTax ? subtotal : subtotal + personTax
			const personTip = tipBase * tipRate
			const total = subtotal + personTax + personTip

			return {
				name,
				items: personItems.sort(byName),
				subtotal,
				taxAmount: personTax,
				tipAmount: personTip,
				total
			}
		})
		.sort(byName)

	return {
		tabName,
		tabDescription,
		taxPercentage: taxRate * 100,
		taxAmount,
		tipBeforeTax,
		tipPercentage: tipRate * 100,
		tipAmount,
		subTotal,
		total: subTotal + taxAmount + tipAmount,
		items: [...items].sort(byName),
		splitters
	}
}
