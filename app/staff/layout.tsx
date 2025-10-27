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
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1e40af, #1e3a8a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '1.125rem' }}>Loading...</div>
      </div>
    )
  }

  return (
    <AdminProvider>
      <EmployeeProvider>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <EmployeeSidebar />
          <main style={{
            flex: 1,
            background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
            overflow: 'auto',
            marginLeft: 0,
            padding: '1.5rem 2rem'
          }}>
            {children}
          </main>
        </div>
      </EmployeeProvider>
    </AdminProvider>
  )
}
