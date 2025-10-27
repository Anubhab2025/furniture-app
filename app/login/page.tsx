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

    try {
      login(email, password)
      router.push("/")
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Login</h1>
        <p className="text-secondary mb-6">Furniture Quotation System</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="text-error text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">Demo Accounts:</p>
          <div className="space-y-2">
            <button
              onClick={() => fillDemoCredentials("admin")}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-primary rounded text-sm transition"
            >
              Admin: admin@furniture.com
            </button>
            <button
              onClick={() => fillDemoCredentials("employee")}
              className="w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 text-success rounded text-sm transition"
            >
              Employee: employee@furniture.com
            </button>
            <button
              onClick={() => fillDemoCredentials("customer")}
              className="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 text-accent rounded text-sm transition"
            >
              Customer: customer@furniture.com
            </button>
          </div>
          <p className="text-xs text-secondary mt-3">All demo passwords are: admin123, emp123, cust123</p>
        </div>
      </div>
    </div>
  )
}
