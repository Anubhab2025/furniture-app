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

  // Show login form when not authenticated
  if (!isAuthenticated) {
    console.log("🔐 Home page - Not authenticated, showing login form")
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#1f2937' }}>Furniture Quotation</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>Professional business management system</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              href="/login"
              style={{ display: 'block', width: '100%', background: '#1e40af', color: 'white', fontWeight: '600', padding: '0.75rem 1rem', borderRadius: '0.5rem', textAlign: 'center', textDecoration: 'none', transition: 'background-color 0.2s' }}
              onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLElement).style.backgroundColor = '#1e40af'}
            >
              Login to System
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>Demo credentials available on login page</p>
          </div>
        </div>
      </div>
    )
  }

  // This should not be reached due to redirect, but just in case
  console.log("⚠️ Home page - Unexpected state")
  return null
}
