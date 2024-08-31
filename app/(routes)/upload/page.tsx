"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadIcon, AlertCircle, ArrowLeft, Loader } from "lucide-react"
import { useDropzone, FileRejection, DropEvent } from "react-dropzone"
import { useCallback, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

const dummyApiRequest = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve("/result-page")
      } else {
        reject(new Error("API request failed"))
      }
    }, 2000)
  })
}

export default function Component() {
  const [error, setError] = useState("")
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

  const onSubmit = async (data: UploadFormValues) => {
    try {
      const result = await dummyApiRequest()
      router.push(result)
    } catch (error) {
      setError(
        "An error occurred while processing your request. Please try again."
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
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                            isDragActive
                              ? "border-primary bg-primary/10"
                              : isDragReject
                                ? "border-destructive bg-destructive/10"
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
                              }
                            }}
                          />
                          {isDragReject ? (
                            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                          ) : (
                            <UploadIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                          )}
                          <p className="mb-2 text-lg font-semibold">
                            {value
                              ? value.name
                              : isDragActive
                                ? "Drop the file here"
                                : "Drag & Drop your receipt here"}
                          </p>
                          <p className="text-center text-sm text-muted-foreground">
                            {isDragReject
                              ? "Invalid file type. Please upload an image."
                              : value
                                ? "Click or drag to replace"
                                : "or click to select a file"}
                          </p>
                        </div>
                      </FormControl>
                      <FormDescription>
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
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
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
