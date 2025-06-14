import * as falso from "@ngneat/falso"
import { type ClassValue, clsx } from "clsx"
import { Banknote, DollarSign, type LucideIcon } from "lucide-react"
import {
	type DescriptionType,
	type SplitSchema,
	type TabSchema,
	tabSchema
} from "src/lib/schemas"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const shuffleArray = <T>(array: T[]): T[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
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

export const generateExampleTab = (): TabSchema => {
	const removeDups = <T>(array: T[]): T[] => [...new Set(array)]

	const capitalizeFirstLetter = (str: string) =>
		str.charAt(0).toUpperCase() + str.slice(1)

	const mealTypes = [
		"Dinner",
		"Lunch",
		"Brunch",
		"Breakfast",
		"Drinks",
		"Snacks",
		"Party",
		"Meetup",
		"Celebration",
		"Gathering"
	].map((meal) => `${capitalizeFirstLetter(meal)} at`)

	const splitters = removeDups(
		falso.randFirstName({
			length: falso.randNumber({ min: 2, max: 10 }),
			withAccents: false
		})
	).map((name) => ({ name }))

	const items = removeDups(
		falso.randFood({ length: falso.randNumber({ min: 2, max: 15 }) })
	).map((item) => ({
		name: item,
		price: falso.randNumber({ min: 5, max: 70, precision: 2 }),
		splitters: shuffleArray(splitters).slice(
			0,
			falso.randNumber({ min: 1, max: splitters.length })
		)
	}))

	const tabDescriptionType = falso.rand([
		"Venmo",
		"Cash App",
		"PayPal"
	] as const)

	const tabDescriptionDetails = ["Venmo", "Cash App"].includes(
		tabDescriptionType
	)
		? "saharshxyz"
		: ["PayPal"].includes(tabDescriptionType)
			? "saharshy"
			: falso.randQuote()

	return {
		tabName: `${falso.randWeekday()} ${falso.rand(mealTypes)} ${falso.randDepartment()} ${falso.randWord({ capitalize: true })}`,
		tabDescription: {
			type: tabDescriptionType,
			details: tabDescriptionDetails
		},
		taxAmount: falso.randNumber({ min: 2, max: 20, precision: 2 }),
		tipBeforeTax: falso.randBoolean(),
		tipAmount: falso.randNumber({ min: 30, max: 30, precision: 2 }),
		items,
		splitters
	}
}

export const paymentInfo = (
	type: Exclude<DescriptionType, "None" | "Other">,
	details: string
): { url: string; type: string; display: string; icon: LucideIcon } => {
	const urlMap: Record<Exclude<DescriptionType, "None" | "Other">, string> = {
		Venmo: `https://venmo.com/${details}`,
		PayPal: `https://paypal.me/${details}`,
		"Cash App": `https://cash.app/$${details}`
	}

	const displayMap: Record<
		Exclude<DescriptionType, "None" | "Other">,
		string
	> = {
		Venmo: `@${details}`,
		PayPal: `@${details}`,
		"Cash App": `$${details}`
	}

	const iconMap: Record<
		Exclude<DescriptionType, "None" | "Other">,
		LucideIcon
	> = {
		Venmo: Banknote,
		PayPal: Banknote,
		"Cash App": DollarSign
	}

	return {
		url: urlMap[type],
		type,
		display: displayMap[type],
		icon: iconMap[type]
	}
}

export const genTab = (initialData?: unknown): TabSchema => {
	const defaultTab: TabSchema = {
		tabName: "",
		tabDescription: { type: "None", details: undefined },
		taxAmount: 0,
		tipBeforeTax: true,
		tipAmount: 0,
		splitters: [{ name: "" }, { name: "" }],
		items: [
			{
				name: "",
				price: 0,
				splitters: [{ name: "" }]
			},
			{
				name: "",
				price: 0,
				splitters: [{ name: "" }]
			}
		]
	}

	if (typeof initialData !== "object" || initialData === null) return defaultTab

	const result = tabSchema.safeParse({
		...defaultTab,
		...initialData
	})

	return result.success ? result.data : defaultTab
}
