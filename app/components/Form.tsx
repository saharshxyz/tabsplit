"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { formSchema, FormSchema } from "@/lib/schemas"
import { PlusIcon, X } from "lucide-react"

export function SplittingForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkName: "",
      taxAmount: 0,
      tipBeforeTax: true,
      tipAmount: 0,
      eaters: [],
      items: []
    }
  })

  const onSubmit = async (values: FormSchema) => {
    try {
      const validatedData = await formSchema.parseAsync(values)
      console.log(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors)
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            form.setError(err.path as any, {
              type: "manual",
              message: err.message
            })
          }
        })
      } else {
        console.error("An unexpected error occurred:", error)
      }
    }
  }

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem
  } = useFieldArray({
    control: form.control,
    name: "items"
  })

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
                  <Input placeholder="Dinner at Restaurant" {...field} />
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
                    placeholder="Enter tip amount"
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
          <div className="space-y-2">
            {form.watch("eaters").map((eater, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormItem className="mb-0 flex-grow">
                  <FormControl>
                    <Input
                      value={eater}
                      onChange={(e) => {
                        const newEaters = [...form.getValues("eaters")]
                        newEaters[index] = e.target.value
                        form.setValue("eaters", newEaters)
                        form.trigger("eaters")
                      }}
                      placeholder="Eater's name"
                    />
                  </FormControl>
                  {form.formState.errors.eaters &&
                    Array.isArray(form.formState.errors.eaters) &&
                    form.formState.errors.eaters[index] && (
                      <FormMessage>
                        {form.formState.errors.eaters[index]?.message}
                      </FormMessage>
                    )}
                </FormItem>
                <Button
                  type="button"
                  onClick={() => {
                    const newEaters = form
                      .getValues("eaters")
                      .filter((_, i) => i !== index)
                    form.setValue("eaters", newEaters)
                    form.trigger("eaters")
                  }}
                  className="h-10 w-10 p-1"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.eaters &&
            !Array.isArray(form.formState.errors.eaters) && (
              <FormMessage className="mt-2">
                {form.formState.errors.eaters.message}
              </FormMessage>
            )}
          <Button
            type="button"
            onClick={() => {
              form.setValue("eaters", [...form.getValues("eaters"), ""])
              form.trigger("eaters")
            }}
            className="mt-2 w-full"
            variant="secondary"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Eater
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-start gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Item name" />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage>
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem className="w-1/4">
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="Price"
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
                      className="mt-6 h-10 w-10 p-1"
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
                          {form.watch("eaters").map((eater, eaterIndex) => (
                            <FormItem
                              key={eaterIndex}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(eater)}
                                  onCheckedChange={(checked) => {
                                    const updatedEaters = checked
                                      ? [...(field.value || []), eater]
                                      : (field.value || []).filter(
                                          (value) => value !== eater
                                        )
                                    field.onChange(updatedEaters)
                                    form.trigger(`items.${index}.eaters`)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {eater}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              onClick={() => appendItem({ name: "", price: 0, eaters: [] })}
              className="w-full"
              variant="secondary"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
          <FormField
            control={form.control}
            name="items"
            render={({ field, fieldState }) => {
              return (
                <div className="px-6 pb-4">
                  {fieldState.error?.root?.message && (
                    <p className="font-medium text-destructive">
                      {fieldState.error.root.message}
                    </p>
                  )}
                </div>
              )
            }}
          />
        </Card>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
