"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthContextType } from "@/types/index"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for demo
const DUMMY_USERS: Record<string, User & { password: string }> = {
  "admin@furniture.com": {
    id: "admin-1",
    name: "Admin User",
    email: "admin@furniture.com",
    phone: "+1234567890",
    role: "admin",
    password: "admin123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: new Date().toISOString(),
  },
  "employee@furniture.com": {
    id: "emp-1",
    name: "John Sales",
    email: "employee@furniture.com",
    phone: "+1234567891",
    role: "employee",
    password: "emp123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    target: 50000,
    createdAt: new Date().toISOString(),
  },
  "customer@furniture.com": {
    id: "cust-1",
    name: "Customer User",
    email: "customer@furniture.com",
    phone: "+1234567892",
    role: "customer",
    password: "cust123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer",
    createdAt: new Date().toISOString(),
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    const dummyUser = DUMMY_USERS[email]
    if (dummyUser && dummyUser.password === password) {
      const { password: _, ...userWithoutPassword } = dummyUser
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      console.log("✅ Login successful:", userWithoutPassword)
    } else {
      console.log("❌ Login failed for:", email)
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, setUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
