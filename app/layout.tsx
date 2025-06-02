import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { StyleChecker } from "@/components/style-checker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fitness AI Gym Buddy",
  description: "Your AI-powered fitness companion for workouts, nutrition, and motivation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force CSS reload by adding a timestamp */}
        <meta name="css-reload" content={Date.now().toString()} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <StyleChecker />
        </ThemeProvider>
      </body>
    </html>
  )
}
