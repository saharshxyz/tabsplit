import { NextRequest, NextResponse } from "next/server"
import { tabSchema, splitSchema, TabSchema } from "@/lib/schemas"
import { calculateSplit } from "@/lib/utils"
import { getURLArgs, logZodErrors, getBaseUrl } from "@/lib/utils"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData: TabSchema = tabSchema.parse(body)

    return NextResponse.json({
      link: getURLArgs(validatedData).join("#"),
      split: splitSchema.parse(calculateSplit(validatedData))
    })
  } catch (error) {
    if (error instanceof ZodError) {
      logZodErrors(error, "Split API")

      const errorMessages = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message
      }))
      return NextResponse.json({ errors: errorMessages }, { status: 400 })
    } else if (error instanceof Error) {
      console.error("Split API Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error("Split API Unknown Error:", error)
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      )
    }
  }
}
