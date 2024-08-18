import type { Metadata } from "next"

export function generateMetadata(
  title: string = "MultiSplit",
  description: string = "Split checks with ease"
): Metadata {
  const fullTitle = title === "MultiSplit" ? title : `${title} | MultiSplit`

  return {
    metadataBase: new URL("https://multisplit.saharsh.xyz"),
    title: {
      default: fullTitle,
      template: "%s | MultiSplit"
    },
    description,
    openGraph: {
      title: {
        default: fullTitle,
        template: "%s | MultiSplit"
      },
      description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
      ]
    }
  }
}
