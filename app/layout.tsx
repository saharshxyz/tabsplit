import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { generateMetadata } from "@/lib/generateMetadata"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

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
        <div className="min-h-screen w-full max-w-prose">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors expand={false} />
            <Analytics />
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
