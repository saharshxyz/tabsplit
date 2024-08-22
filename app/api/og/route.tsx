import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

const interBoldFontP = fetch(
  new URL("../../../public/Inter-Bold.otf", import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get("title") || "TabSplit"
  const description = searchParams.get("description") || "Split Tabs with ease"
  const width = parseInt(searchParams.get("width") || "1200", 10)
  const height = parseInt(searchParams.get("height") || "630", 10)

  const [interBoldFont] = await Promise.all([interBoldFontP])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "white",
          backgroundImage:
            "radial-gradient(circle at 20px 20px, #a0a0a0 3%, transparent 0%), radial-gradient(circle at 60px 60px, #a0a0a0 3%, transparent 0%)",
          backgroundSize: "80px 80px",
          fontFamily: "Inter"
        }}
      >
        <div
          style={{
            margin: "64px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px"
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                borderRadius: "16px",
                padding: "16px",
                marginRight: "24px",
                display: "flex"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="96"
                height="96"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a202c"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 3h5v5" />
                <path d="M8 3H3v5" />
                <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
                <path d="m15 9 6-6" />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "6rem",
                fontWeight: 700,
                color: "#1a202c",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                borderRadius: "16px",
                padding: "0 16px"
              }}
            >
              {title}
            </h1>
          </div>
          <p
            style={{
              fontSize: "3.75rem",
              fontWeight: 700,
              color: "#4a5568",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              borderRadius: "16px",
              padding: "8px 16px"
            }}
          >
            {description}
          </p>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "Inter",
          data: interBoldFont,
          style: "normal",
          weight: 700
        }
      ]
    }
  )
}
