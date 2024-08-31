"use client"

import React, { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  UploadIcon,
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
  CheckCircle
} from "lucide-react"
import { useDropzone, FileRejection, DropEvent } from "react-dropzone"
import { useCallback, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  fileToBase64,
  convertReceiptToStructuredOutput,
  getURLArgs,
  transformPartialToFullTab
} from "@/lib/utils"
import { PartialTabSchema } from "@/lib/schemas"

const ACCEPTED_FILE_TYPES = [".jpeg", ".jpg", ".png", ".gif", ".webp"]

const uploadFormSchema = z.object({
  receipt: z
    .instanceof(File, {
      message: "Please upload a valid receipt image."
    })
    .refine((file) => file.size > 0, {
      message: "Please upload a valid receipt image."
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB."
    })
    .refine(
      (file) =>
        ACCEPTED_FILE_TYPES.includes(
          `.${file.name.split(".").pop()?.toLowerCase()}`
        ),
      {
        message: `File type must be ${ACCEPTED_FILE_TYPES.join(", ")}.`
      }
    )
})

type UploadFormValues = z.infer<typeof uploadFormSchema>

export default function Component() {
  const [error, setError] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const router = useRouter()

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      receipt: undefined
    }
  })

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      rejectedFiles: FileRejection[],
      event: DropEvent
    ) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        form.setValue("receipt", acceptedFiles[0], { shouldValidate: true })
        setFileUploaded(true)
      } else {
        setFileUploaded(false)
      }
    },
    [form]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": ACCEPTED_FILE_TYPES
      },
      maxFiles: 1
    })

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "receipt") {
        setFileUploaded(!!value.receipt)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: UploadFormValues) => {
    try {
      const base64Image = await fileToBase64(data.receipt)
      const structuredOutput =
        await convertReceiptToStructuredOutput(base64Image)

      const url = `/#${
        getURLArgs(
          transformPartialToFullTab(structuredOutput as PartialTabSchema)
        )[1]
      }`

      router.push(url)
    } catch (error) {
      setError(
        "An error occurred while processing your request. Please try again or fill out manually."
      )
    }
  }

  return (
    <main className="mx-auto mt-5 flex min-h-screen max-w-3xl items-center justify-center overflow-hidden">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-4 inline-block">
          <Button variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" /> Fill out manually
          </Button>
        </Link>

        <Card className="w-full p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Upload Receipt
            </CardTitle>
            <CardDescription>
              Upload a picture of your receipt and you will be redirected to a
              pre-filled form. Note that this uses OpenAI and results may vary.
              We recommend verifying the auto-populated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="receipt"
                  render={({
                    field: { onChange, value, ...rest },
                    fieldState: { error }
                  }) => (
                    <FormItem>
                      <FormLabel>Receipt</FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                            isDragActive
                              ? "border-primary bg-primary/10"
                              : isDragReject
                                ? "border-destructive bg-destructive/10"
                                : fileUploaded
                                  ? "border-green-500 bg-green-50"
                                  : "border-muted-foreground/25 hover:border-primary/50"
                          }`}
                        >
                          <input
                            {...getInputProps()}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                onChange(file)
                                setFileUploaded(true)
                              } else {
                                setFileUploaded(false)
                              }
                            }}
                          />
                          {fileUploaded ? (
                            <CheckCircle className="mb-4 !h-8 text-green-500" />
                          ) : isDragReject ? (
                            <AlertCircle className="mb-4 !h-10 text-destructive" />
                          ) : (
                            <UploadIcon className="mb-4 !h-8 text-muted-foreground" />
                          )}
                          <p className="mb-2 font-semibold">
                            {form.watch("receipt")
                              ? form.watch("receipt").name
                              : isDragActive
                                ? "Drop the file here"
                                : fileUploaded
                                  ? "File uploaded successfully"
                                  : "Drag & Drop your receipt here"}
                          </p>
                          <p className="text-center text-sm text-muted-foreground">
                            {isDragReject
                              ? "Invalid file type. Please upload an image."
                              : form.watch("receipt")
                                ? "Click or drag to replace"
                                : "or click to select a file"}
                          </p>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Accepted file types:{" "}
                        {React.createElement(
                          React.Fragment,
                          null,
                          ACCEPTED_FILE_TYPES.map((type, index) => (
                            <React.Fragment key={type}>
                              {index > 0 && ", "}
                              <code>{type}</code>
                            </React.Fragment>
                          ))
                        )}
                      </FormDescription>
                      {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
