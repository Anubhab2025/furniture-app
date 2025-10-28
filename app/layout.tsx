import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/src/contexts/AuthContext"
import { EmployeeProvider } from "@/src/contexts/EmployeeContext"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Furniture Quotation System",
  description: "Dynamic furniture business management system",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <AuthProvider>
          <EmployeeProvider>
            {children}
          </EmployeeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}