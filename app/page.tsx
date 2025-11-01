"use client"

import Link from "next/link"
import { useAuth } from "@/src/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  console.log("🏠 Home page - Auth state:", { isAuthenticated, user: user?.role, isLoading })

  useEffect(() => {
    console.log("🔄 Home page - useEffect triggered:", { isAuthenticated, user: user?.role })
    if (isAuthenticated && user) {
      console.log("🚀 Redirecting to:", user.role === "admin" ? "/admin" : user.role === "employee" ? "/staff" : "/customer/quotations")
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "employee") {
        router.push("/staff")
      } else if (user.role === "customer") {
        router.push("/customer/quotations")
      }
    }
  }, [isAuthenticated, user, router])

  // Show loading while checking authentication
  if (isLoading) {
    console.log("⏳ Home page - Loading state")
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ color: 'white', fontSize: '1.125rem' }}>Loading...</div>
      </div>
    )
  }

  // Redirect to login when not authenticated
  if (!isAuthenticated) {
    console.log("🔐 Home page - Not authenticated, redirecting to login")
    useEffect(() => {
      router.push('/login')
    }, [router])
    return null
  }

  // This should not be reached due to redirect, but just in case
  console.log("⚠️ Home page - Unexpected state")
  return null
}
