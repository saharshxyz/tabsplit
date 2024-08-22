import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get("title") || "TabSplit"
  const description = searchParams.get("description") || "Split Tabs with ease"
  const width = parseInt(searchParams.get("width") || "1200", 10)
  const height = parseInt(searchParams.get("height") || "630", 10)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "64px",
          backgroundImage:
            "radial-gradient(circle, #e0e0e0 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        <h1
          style={{
            fontSize: "6rem",
            fontWeight: 800,
            marginBottom: "24px",
            color: "#1a202c"
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "3.75rem",
            fontWeight: 700,
            color: "#4a5568"
          }}
        >
          {description}
        </p>
      </div>
    ),
    {
      width,
      height
    }
  )
}
