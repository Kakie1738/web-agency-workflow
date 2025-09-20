import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/lib/convex-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Web Agency Workflow System",
  description: "Futuristic workflow management for web agencies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <Suspense>
            <ConvexClientProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </ConvexClientProvider>
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
