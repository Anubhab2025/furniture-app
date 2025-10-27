"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/src/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("🔑 Login attempt:", { email, password: "***" })

    try {
      login(email, password)
      console.log("✅ Login successful, redirecting to home...")
      // Give a small delay for state to update
      setTimeout(() => {
        router.push("/")
      }, 100)
    } catch (err) {
      console.log("❌ Login failed:", err)
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role: "admin" | "employee" | "customer") => {
    const credentials: Record<string, { email: string; password: string }> = {
      admin: { email: "admin@furniture.com", password: "admin123" },
      employee: { email: "employee@furniture.com", password: "emp123" },
      customer: { email: "customer@furniture.com", password: "cust123" },
    }
    const creds = credentials[role]
    setEmail(creds.email)
    setPassword(creds.password)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1f2937' }}>Login</h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Furniture Quotation System</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : '#1e40af',
              color: 'white',
              fontWeight: '600',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937', marginBottom: '0.75rem' }}>Demo Accounts:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => fillDemoCredentials("admin")}
              style={{ width: '100%', textAlign: 'left', padding: '0.75rem', background: '#eff6ff', color: '#1e40af', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#dbeafe'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#eff6ff'}
            >
              Admin: admin@furniture.com
            </button>
            <button
              onClick={() => fillDemoCredentials("employee")}
              style={{ width: '100%', textAlign: 'left', padding: '0.75rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#dcfce7'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#f0fdf4'}
            >
              Employee: employee@furniture.com
            </button>
            <button
              onClick={() => fillDemoCredentials("customer")}
              style={{ width: '100%', textAlign: 'left', padding: '0.75rem', background: '#fffbeb', color: '#d97706', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#fef3c7'}
              onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#fffbeb'}
            >
              Customer: customer@furniture.com
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.75rem' }}>All demo passwords are: admin123, emp123, cust123</p>
        </div>
      </div>
    </div>
  )
}
