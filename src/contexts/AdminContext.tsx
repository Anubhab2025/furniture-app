"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Customer, Product } from "@/types/index"
import { DUMMY_CUSTOMERS, DUMMY_PRODUCTS } from "@/src/utils/dummy-data"

interface AdminContextType {
  customers: Customer[]
  products: Product[]
  employees: any[]
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [employees] = useState([
    {
      id: "emp-1",
      name: "John Sales",
      email: "employee@furniture.com",
      role: "Sales Staff",
      status: "active",
      quotations: 12,
      conversionRate: 65,
    },
    {
      id: "emp-2",
      name: "Sarah Manager",
      email: "sarah@furniture.com",
      role: "Manager",
      status: "active",
      quotations: 28,
      conversionRate: 78,
    },
  ])

  useEffect(() => {
    setCustomers(DUMMY_CUSTOMERS)
    setProducts(DUMMY_PRODUCTS)
  }, [])

  const addCustomer = (customer: Customer) => {
    setCustomers([...customers, customer])
    localStorage.setItem("customers", JSON.stringify([...customers, customer]))
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
    setCustomers(updated)
    localStorage.setItem("customers", JSON.stringify(updated))
  }

  const deleteCustomer = (id: string) => {
    const filtered = customers.filter((c) => c.id !== id)
    setCustomers(filtered)
    localStorage.setItem("customers", JSON.stringify(filtered))
  }

  const addProduct = (product: Product) => {
    setProducts([...products, product])
    localStorage.setItem("products", JSON.stringify([...products, product]))
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    setProducts(updated)
    localStorage.setItem("products", JSON.stringify(updated))
  }

  const deleteProduct = (id: string) => {
    const filtered = products.filter((p) => p.id !== id)
    setProducts(filtered)
    localStorage.setItem("products", JSON.stringify(filtered))
  }

  return (
    <AdminContext.Provider
      value={{
        customers,
        products,
        employees,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
