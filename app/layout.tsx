import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/lib/convex-provider"
import { Toaster } from "@/components/ui/toaster"
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
  // Only enable Clerk in production if valid keys are present
  const hasValidClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')

  if (hasValidClerkKeys) {
    return (
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
            <Suspense>
              <ConvexClientProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  {children}
                  <Toaster />
                </ThemeProvider>
              </ConvexClientProvider>
            </Suspense>
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    )
  }

  // Fallback without authentication
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense>
          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </ConvexClientProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
