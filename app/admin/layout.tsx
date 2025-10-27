"use client"

import type React from "react"
import { AdminProvider } from "@/src/contexts/AdminContext"
import { AdminSidebar } from "@/src/components/admin/AdminSidebar"
import { useAuthGuard } from "@/src/hooks/useAuthGuard"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthGuard("admin")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <AdminProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-background overflow-auto">{children}</main>
      </div>
    </AdminProvider>
  )
}
