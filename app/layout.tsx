import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { generateMetadata } from "@/lib/generateMetadata"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = generateMetadata()

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body className="flex items-center justify-center">
        <main className="mx-auto flex min-h-dvh max-w-prose items-center justify-center overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand={false} />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
