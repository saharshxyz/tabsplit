import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { partialTabSchema } from "@/lib/schemas"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { base64Image } = await request.json()

    const chatCompletion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Extract the tab information." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract information from this receipt image:"
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      response_format: zodResponseFormat(partialTabSchema, "tab"),
      max_tokens: 16384
    })

    return NextResponse.json(chatCompletion.choices[0].message.parsed)
  } catch (error) {
    console.error("Error processing receipt:", error)
    return NextResponse.json(
      { error: "Error processing receipt" },
      { status: 500 }
    )
  }
}
