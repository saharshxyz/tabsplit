import { NextRequest, NextResponse } from "next/server";
import { formSchema, splitSchema, FormSchema } from "@/lib/schemas";
import { calculateSplit } from "@/lib/calculateSplit";
import { createSplitURL, logZodErrors } from "@/lib/utils";
import { ZodError } from "zod";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData: FormSchema = formSchema.parse(body);

    const result = calculateSplit(validatedData);

    const validatedResult = splitSchema.parse(result);

    const headersList = headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto");
    const baseUrl =
      `${protocol}://${host}/split` ||
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/split`;

    const [link] = createSplitURL(validatedData, baseUrl);

    return NextResponse.json({
      link,
      split: validatedResult,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logZodErrors(error, "Split API");

      const errorMessages = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    } else if (error instanceof Error) {
      console.error("Split API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Split API Unknown Error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
