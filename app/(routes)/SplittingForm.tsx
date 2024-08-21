"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { useEffect, useMemo, useRef, useCallback } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { formSchema, FormSchema } from "@/lib/schemas"
import { PlusIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePlaceholders } from "@/lib/usePlaceholders"
import { ReceiptText } from "lucide-react"

interface SplittingFormProps {
  initialData: Partial<FormSchema>
}

export function SplittingForm({ initialData }: SplittingFormProps) {
  const router = useRouter()

  const {
    randomPlaceholders,
    eaterPlaceholders,
    itemPlaceholders,
    appendEaterPlaceholder,
    appendItemPlaceholder
  } = usePlaceholders()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkName: initialData.checkName || "",
      taxAmount: initialData.taxAmount || 0,
      tipBeforeTax: initialData.tipBeforeTax ?? true,
      tipAmount: initialData.tipAmount || 0,
      eaters: initialData.eaters || [],
      items: initialData.items || []
    }
  })

  const isInitialLoad = useRef(true)
  const [eaterParentRef, enableEaterAnimations] =
    useAutoAnimate<HTMLDivElement>()
  const [itemParentRef, enableItemAnimations] = useAutoAnimate<HTMLDivElement>()

  useEffect(() => {
    if (isInitialLoad.current) {
      enableEaterAnimations(false)
      enableItemAnimations(false)

      setTimeout(() => {
        enableEaterAnimations(true)
        enableItemAnimations(true)
        isInitialLoad.current = false
      }, 100)
    }
  }, [enableEaterAnimations, enableItemAnimations])

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      form.reset({
        checkName: initialData.checkName || "",
        taxAmount: initialData.taxAmount || 0,
        tipBeforeTax: initialData.tipBeforeTax ?? true,
        tipAmount: initialData.tipAmount || 0,
        eaters: initialData.eaters || [],
        items: initialData.items || []
      })
    }
  }, [initialData, form])

  const {
    fields: eaterFields,
    append: appendEater,
    remove: removeEater
  } = useFieldArray({
    control: form.control,
    name: "eaters"
  })

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
    update: updateItem
  } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const watchedEaters = useWatch({
    control: form.control,
    name: "eaters"
  })

  const validEaters = useMemo(
    () =>
      watchedEaters.filter(
        (eater) => typeof eater.name === "string" && eater.name.trim() !== ""
      ),
    [watchedEaters]
  )

  const previousValidEatersRef = useRef(validEaters)

  useEffect(() => {
    if (
      JSON.stringify(previousValidEatersRef.current) !==
      JSON.stringify(validEaters)
    ) {
      itemFields.forEach((item, index) => {
        const updatedEaters = item.eaters.filter((eater) =>
          validEaters.some((validEater) => validEater.name === eater.name)
        )
        if (JSON.stringify(updatedEaters) !== JSON.stringify(item.eaters)) {
          updateItem(index, { ...item, eaters: updatedEaters })
        }
      })
      previousValidEatersRef.current = validEaters
    }
  }, [validEaters, itemFields, updateItem])

  useEffect(() => {
    if (eaterFields.length > 1) {
      form.trigger("eaters")
    }
  }, [eaterFields, form])

  const appendEaterWithPlaceholder = useCallback(() => {
    appendEaterPlaceholder()
    appendEater({ name: "" })
  }, [appendEater, appendEaterPlaceholder])

  const appendItemWithPlaceholder = useCallback(() => {
    appendItemPlaceholder()
    appendItem({ name: "", price: 0, eaters: [] })
  }, [appendItem, appendItemPlaceholder])

  const onSubmit = useCallback(
    (values: FormSchema) => {
      const params = new URLSearchParams()
      params.set("checkName", values.checkName || "")
      params.set("taxAmount", values.taxAmount?.toString() || "")
      params.set("tipBeforeTax", values.tipBeforeTax ? "true" : "false")
      params.set("tipAmount", values.tipAmount?.toString() || "")
      params.set("eaters", JSON.stringify(values.eaters))
      params.set("items", JSON.stringify(values.items))

      router.push(`/split#${params.toString()}`)
    },
    [router]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-8">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="checkName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Check Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={randomPlaceholders.checkName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    {...field}
                    placeholder={randomPlaceholders.taxAmount}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Tip Amount</FormLabel>
            <FormField
              control={form.control}
              name="tipBeforeTax"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel className="mb-0">Tip Before Tax</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tipAmount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder={randomPlaceholders.tipAmount}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormLabel>Eaters</FormLabel>
          <div className="space-y-2" ref={eaterParentRef}>
            {eaterFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`eaters.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="mb-0 flex-grow">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            eaterPlaceholders[index]?.name ||
                            randomPlaceholders.eaterName
                          }
                          onChange={(e) => {
                            field.onChange(e)
                            form.trigger("eaters")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => removeEater(index)}
                  className="h-10 w-10 p-1"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage className="mt-1">
            {form.formState.errors.eaters?.root?.message}
          </FormMessage>
          <Button
            type="button"
            onClick={appendEaterWithPlaceholder}
            className="mt-2 w-full"
            variant="secondary"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Eater
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 text-lg font-semibold">Items</h3>
          <div className="space-y-4" ref={itemParentRef}>
            {itemFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-6 px-4 sm:px-6">
                  <div className="mb-4 flex items-start gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                itemPlaceholders[index]?.name ||
                                randomPlaceholders.itemName
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="w-2/5 sm:w-1/4">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder={
                                itemPlaceholders[index]?.price ||
                                randomPlaceholders.itemPrice
                              }
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-6 hidden h-10 w-10 p-1 sm:flex"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`items.${index}.eaters`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Eaters</FormLabel>
                          <FormDescription>
                            Select who ate this item
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {validEaters.map((eater) => (
                            <FormItem
                              key={eater.name}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.some(
                                    (e) => e.name === eater.name
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentEaters = field.value || []
                                    let updatedEaters
                                    if (checked) {
                                      updatedEaters = [
                                        ...currentEaters,
                                        { name: eater.name }
                                      ]
                                    } else {
                                      updatedEaters = currentEaters.filter(
                                        (e) => e.name !== eater.name
                                      )
                                    }
                                    field.onChange(updatedEaters)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {eater.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-4 w-full sm:hidden"
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Item
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              onClick={appendItemWithPlaceholder}
              className="w-full"
              variant="secondary"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <FormField
            control={form.control}
            name="items"
            render={({ fieldState }) => (
              <div className="px-6 pb-4">
                {fieldState.error?.root?.message && (
                  <p className="font-medium text-destructive">
                    {fieldState.error.root.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Submit
          <ReceiptText className="ml-2 h-4 w-4" strokeWidth={2} />
        </Button>
      </form>
    </Form>
  )
}
