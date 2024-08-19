import { useState, useCallback, useMemo } from "react"

const names = [
  "Alex",
  "Sam",
  "Jordan",
  "Taylor",
  "Casey",
  "Morgan",
  "Riley",
  "Jamie",
  "Quinn",
  "Avery"
]
const restaurants = [
  "Pizzeria",
  "Sushi Bar",
  "Cafe",
  "Steakhouse",
  "Bistro",
  "Diner",
  "Taco Place",
  "Burger Joint"
]
const items = [
  "Pizza",
  "Salad",
  "Burger",
  "Pasta",
  "Sushi",
  "Steak",
  "Sandwich",
  "Soup",
  "Fries",
  "Dessert"
]

const getRandomElement = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)]
const getRandomAmount = (upperLimit: number) =>
  (Math.random() * upperLimit + 5).toFixed(2)

export interface Placeholder {
  checkName: string
  taxAmount: string
  tipAmount: string
  eaterName: string
  itemName: string
  itemPrice: string
}

export interface EaterPlaceholder {
  name: string
}

export interface ItemPlaceholder {
  name: string
  price: string
}

export function usePlaceholders() {
  const [eaterPlaceholders, setEaterPlaceholders] = useState<
    EaterPlaceholder[]
  >([])
  const [itemPlaceholders, setItemPlaceholders] = useState<ItemPlaceholder[]>(
    []
  )

  const randomPlaceholders = useMemo<Placeholder>(
    () => ({
      checkName: `Dinner at ${getRandomElement(restaurants)}`,
      taxAmount: getRandomAmount(23),
      tipAmount: getRandomAmount(40),
      eaterName: getRandomElement(names),
      itemName: getRandomElement(items),
      itemPrice: getRandomAmount(30)
    }),
    []
  )

  const generateEaterPlaceholder = useCallback(
    (): EaterPlaceholder => ({
      name: getRandomElement(names)
    }),
    []
  )

  const generateItemPlaceholder = useCallback(
    (): ItemPlaceholder => ({
      name: getRandomElement(items),
      price: getRandomAmount(30)
    }),
    []
  )

  const appendEaterPlaceholder = useCallback(() => {
    setEaterPlaceholders((prev) => [...prev, generateEaterPlaceholder()])
  }, [generateEaterPlaceholder])

  const appendItemPlaceholder = useCallback(() => {
    setItemPlaceholders((prev) => [...prev, generateItemPlaceholder()])
  }, [generateItemPlaceholder])

  return {
    randomPlaceholders,
    eaterPlaceholders,
    itemPlaceholders,
    appendEaterPlaceholder,
    appendItemPlaceholder
  }
}
