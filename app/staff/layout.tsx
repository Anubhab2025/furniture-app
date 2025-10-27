"use client"

import type React from "react"
import { EmployeeProvider } from "@/src/contexts/EmployeeContext"
import { AdminProvider } from "@/src/contexts/AdminContext"
import { EmployeeSidebar } from "@/src/components/employee/EmployeeSidebar"
import { useAuthGuard } from "@/src/hooks/useAuthGuard"
import { useEffect, useState } from "react"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthGuard("employee")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isAuthenticated) {
    return null
  }

  return (
    <AdminProvider>
      <EmployeeProvider>
        <div className="flex h-screen">
          <EmployeeSidebar />
          <main className="flex-1 bg-background overflow-auto">{children}</main>
        </div>
      </EmployeeProvider>
    </AdminProvider>
  )
}
