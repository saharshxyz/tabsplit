import { SplitSchema, FormSchema, EaterSchema } from "./schemas"

export function calculateSplit(data: FormSchema): SplitSchema {
  const { checkName, taxAmount, tipBeforeTax, tipAmount, items } = data

  const subTotal = items.reduce((acc, curr) => acc + curr.price, 0)

  const tipPercentage = tipBeforeTax
    ? (tipAmount / subTotal) * 100
    : (tipAmount / (subTotal + taxAmount)) * 100

  const findEaterIndexByName = (
    eaters: EaterSchema[],
    name: string
  ): number => {
    return eaters.findIndex(
      (eater) => eater.name.toLowerCase() === name.toLowerCase()
    )
  }

  const total = subTotal + taxAmount + tipAmount
  const taxPercentage = (taxAmount / subTotal) * 100

  const eaters = data.eaters.map((eater) => {
    const createNewEater = (name: string): EaterSchema => {
      return {
        name,
        taxAmount: 0,
        tipAmount: 0,
        total: 0,
        subtotal: 0,
        items: []
      }
    }

    return createNewEater(eater.name)
  })

  items.forEach((item) => {
    const share = item.price / item.eaters.length
    item.eaters.forEach((eater) => {
      const eaterIndex = findEaterIndexByName(eaters, eater.name)
      eaters[eaterIndex].subtotal += share
      eaters[eaterIndex].items.push({ name: item.name })
    })
  })

  eaters.forEach((eater) => {
    eater.taxAmount = eater.subtotal * (taxPercentage / 100)
    eater.tipAmount = tipBeforeTax
      ? eater.subtotal * (tipPercentage / 100)
      : (eater.subtotal + eater.taxAmount) * (tipPercentage / 100)

    eater.total = eater.subtotal + eater.taxAmount + eater.tipAmount
  })

  const split: SplitSchema = {
    checkName,
    taxPercentage: taxPercentage,
    taxAmount: taxAmount,
    tipBeforeTax,
    tipPercentage,
    tipAmount: tipAmount,
    subTotal: subTotal,
    total: total,
    items,
    eaters
  }

  return split
}
