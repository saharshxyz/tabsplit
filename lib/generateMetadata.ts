import type { Metadata } from "next"

export function generateMetadata(
  title: string = "TabSplit",
  description: string = "Split tabs with ease"
): Metadata {
  const fullTitle = title === "TabSplit" ? title : `${title} | TabSplit`

  return {
    metadataBase: new URL(`https://tabsplit.saharsh.xyz`),
    title: {
      default: fullTitle,
      template: "%s | TabSplit"
    },
    description,
    openGraph: {
      title: {
        default: fullTitle,
        template: "%s | TabSplit"
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
