"use client"

import type React from "react"
import { CustomerProvider } from "@/src/contexts/CustomerContext"
import { AdminProvider } from "@/src/contexts/AdminContext"
import { useAuthGuard } from "@/src/hooks/useAuthGuard"
import { useAuth } from "@/src/contexts/AuthContext"
import { useEffect, useState } from "react"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthGuard("customer")
  const { logout, user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <AdminProvider>
      <CustomerProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Furniture Co.</h1>
                <p className="text-sm text-muted-foreground">Customer Portal</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground">Welcome, {user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </CustomerProvider>
    </AdminProvider>
  )
}
