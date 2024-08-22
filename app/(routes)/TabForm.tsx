"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  useFieldArray,
  useWatch,
  useFormContext
} from "react-hook-form"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  tabSchema,
  TabSchema,
  DescriptionType,
  descriptionTypes
} from "@/lib/schemas"
import { PlusIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePlaceholders } from "@/lib/usePlaceholders"
import { ReceiptText } from "lucide-react"
import { PaymentLink } from "@/components/PaymentLink"

function DescriptionDisplay({
  type,
  details
}: {
  type: DescriptionType
  details: string | undefined
}) {
  if (!details) return null

  return (
    <>
      Will display: <PaymentLink type={type} details={details} />
    </>
  )
}

interface TabFormProps {
  initialData: Partial<TabSchema>
}

export function TabForm({ initialData }: TabFormProps) {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [showDetailsField, setShowDetailsField] = useState(false)

  const {
    randomPlaceholders,
    splitterPlaceholders,
    itemPlaceholders,
    appendSplitterPlaceholder,
    appendItemPlaceholder
  } = usePlaceholders()

  const form = useForm<TabSchema>({
    resolver: zodResolver(tabSchema),
    defaultValues: {
      tabName: initialData.tabName || "",
      tabDescription: initialData.tabDescription || {
        type: "None"
      },
      taxAmount: initialData.taxAmount || 0,
      tipBeforeTax: initialData.tipBeforeTax ?? true,
      tipAmount: initialData.tipAmount || 0,
      splitters: initialData.splitters || [],
      items: initialData.items || []
    }
  })

  const descriptionType = useWatch({
    control: form.control,
    name: "tabDescription.type"
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setShowDetailsField(descriptionType !== "None")
  }, [descriptionType])

  const isInitialLoad = useRef(true)
  const [splitterParentRef, enableSplitterAnimations] =
    useAutoAnimate<HTMLDivElement>()
  const [itemParentRef, enableItemAnimations] = useAutoAnimate<HTMLDivElement>()
  const [descriptionParentRef, enableDescriptionAnimations] =
    useAutoAnimate<HTMLDivElement>()

  useEffect(() => {
    if (isInitialLoad.current) {
      enableSplitterAnimations(false)
      enableItemAnimations(false)
      enableDescriptionAnimations(false)

      setTimeout(() => {
        enableSplitterAnimations(true)
        enableItemAnimations(true)
        enableDescriptionAnimations(true)
        isInitialLoad.current = false
      }, 100)
    }
  }, [
    enableSplitterAnimations,
    enableItemAnimations,
    enableDescriptionAnimations
  ])

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      form.reset({
        tabName: initialData.tabName || "",
        tabDescription: initialData.tabDescription || {
          type: "None"
        },
        taxAmount: initialData.taxAmount || 0,
        tipBeforeTax: initialData.tipBeforeTax ?? true,
        tipAmount: initialData.tipAmount || 0,
        splitters: initialData.splitters || [],
        items: initialData.items || []
      })
    }
  }, [initialData, form])

  const {
    fields: splitterFields,
    append: appendSplitter,
    remove: removeSplitter
  } = useFieldArray({
    control: form.control,
    name: "splitters"
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

  const watchedSplitters = useWatch({
    control: form.control,
    name: "splitters"
  })

  const validSplitters = useMemo(
    () =>
      watchedSplitters.filter(
        (splitter) =>
          typeof splitter.name === "string" && splitter.name.trim() !== ""
      ),
    [watchedSplitters]
  )

  const previousValidSplittersRef = useRef(validSplitters)

  useEffect(() => {
    if (
      JSON.stringify(previousValidSplittersRef.current) !==
      JSON.stringify(validSplitters)
    ) {
      itemFields.forEach((item, index) => {
        const updatedSplitters = item.splitters.filter((splitter) =>
          validSplitters.some(
            (validSplitter) => validSplitter.name === splitter.name
          )
        )
        if (
          JSON.stringify(updatedSplitters) !== JSON.stringify(item.splitters)
        ) {
          updateItem(index, { ...item, splitters: updatedSplitters })
        }
      })
      previousValidSplittersRef.current = validSplitters
    }
  }, [validSplitters, itemFields, updateItem])

  useEffect(() => {
    if (splitterFields.length > 1) {
      form.trigger("splitters")
    }
  }, [splitterFields, form])

  const appendSplitterWithPlaceholder = useCallback(() => {
    appendSplitterPlaceholder()
    appendSplitter({ name: "" }, { shouldFocus: !isMobile })
  }, [appendSplitter, appendSplitterPlaceholder, isMobile])

  const appendItemWithPlaceholder = useCallback(() => {
    appendItemPlaceholder()
    appendItem(
      { name: "", price: 0, splitters: [] },
      { shouldFocus: !isMobile }
    )
  }, [appendItem, appendItemPlaceholder, isMobile])

  const onSubmit = useCallback(
    (values: TabSchema) => {
      const params = new URLSearchParams()
      params.set("tabName", values.tabName || "")
      params.set("tabDescription", JSON.stringify(values.tabDescription))
      params.set("taxAmount", values.taxAmount?.toString() || "")
      params.set("tipBeforeTax", values.tipBeforeTax ? "true" : "false")
      params.set("tipAmount", values.tipAmount?.toString() || "")
      params.set("splitters", JSON.stringify(values.splitters))
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
            name="tabName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tab Name</FormLabel>
                <FormControl>
                  <Input placeholder={randomPlaceholders.tabName} {...field} />
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
        <div ref={descriptionParentRef} className="flex space-x-4">
          <FormField
            control={form.control}
            name="tabDescription.type"
            render={({ field }) => (
              <FormItem
                className={`flex-shrink-0 ${showDetailsField ? "w-32" : "w-full"}`}
              >
                <FormLabel>Description Type</FormLabel>
                <Select
                  onValueChange={(value: DescriptionType) => {
                    field.onChange(value)
                    if (value === "None") {
                      form.setValue("tabDescription.details", undefined)
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value || "None"}
                      ></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {descriptionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showDetailsField && (
            <FormField
              control={form.control}
              name="tabDescription.details"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description details" {...field} />
                  </FormControl>
                  <FormMessage />
                  {!form.formState.errors.tabDescription?.details &&
                    form.getValues("tabDescription.type") !== "Other" && (
                      <FormDescription>
                        <DescriptionDisplay
                          type={form.getValues("tabDescription.type")}
                          details={form.getValues("tabDescription.details")}
                        />
                      </FormDescription>
                    )}
                </FormItem>
              )}
            />
          )}
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
          <FormLabel>Splitters</FormLabel>
          <div className="space-y-2" ref={splitterParentRef}>
            {splitterFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`splitters.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="mb-0 flex-grow">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            splitterPlaceholders[index]?.name ||
                            randomPlaceholders.splitterName
                          }
                          onChange={(e) => {
                            field.onChange(e)
                            form.trigger("splitters")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => removeSplitter(index)}
                  className="h-10 w-10 p-1"
                  variant="ghost"
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
          <FormMessage className="mt-1">
            {form.formState.errors.splitters?.root?.message}
          </FormMessage>
          <Button
            type="button"
            onClick={appendSplitterWithPlaceholder}
            className="mt-2 w-full"
            variant="secondary"
          >
            <PlusIcon className="mr-2" />
            Add Splitter
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
                      <X />
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name={`items.${index}.splitters`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Splitters</FormLabel>
                          <FormDescription>
                            Select who ate this item
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {validSplitters.map((splitter) => (
                            <FormItem
                              key={splitter.name}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.some(
                                    (e) => e.name === splitter.name
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentSplitters = field.value || []
                                    let updatedSplitters
                                    if (checked) {
                                      updatedSplitters = [
                                        ...currentSplitters,
                                        { name: splitter.name }
                                      ]
                                    } else {
                                      updatedSplitters =
                                        currentSplitters.filter(
                                          (e) => e.name !== splitter.name
                                        )
                                    }
                                    field.onChange(updatedSplitters)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {splitter.name}
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
                    <X className="mr-2" />
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
              <PlusIcon className="mr-2" />
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
          <ReceiptText className="ml-2" />
        </Button>
      </form>
    </Form>
  )
}
