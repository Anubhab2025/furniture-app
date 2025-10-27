"use client"

import { useAuth } from "@/src/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "employee") {
        router.push("/staff")
      } else if (user.role === "customer") {
        router.push("/customer/quotations")
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-foreground">Furniture Quotation</h1>
        <p className="text-center text-secondary mb-8">Professional business management system</p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg text-center transition"
          >
            Login to System
          </Link>
          <p className="text-center text-sm text-secondary">Demo credentials available on login page</p>
        </div>
      </div>
    </div>
  )
}
