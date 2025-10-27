"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Quotation, Customer } from "@/types/index"
import { DUMMY_QUOTATIONS, DUMMY_CUSTOMERS } from "@/src/utils/dummy-data"

interface EmployeeContextType {
  quotations: Quotation[]
  customers: Customer[]
  createQuotation: (quotation: Quotation) => void
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void
  addCustomer: (customer: Customer) => void
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined)

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    setQuotations(DUMMY_QUOTATIONS)
    setCustomers(DUMMY_CUSTOMERS)
  }, [])

  const createQuotation = (quotation: Quotation) => {
    const updated = [...quotations, quotation]
    setQuotations(updated)
    localStorage.setItem("employee-quotations", JSON.stringify(updated))
  }

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    const updated = quotations.map((q) => (q.id === id ? { ...q, ...updates } : q))
    setQuotations(updated)
    localStorage.setItem("employee-quotations", JSON.stringify(updated))
  }

  const addCustomer = (customer: Customer) => {
    const updated = [...customers, customer]
    setCustomers(updated)
    localStorage.setItem("employee-customers", JSON.stringify(updated))
  }

  return (
    <EmployeeContext.Provider value={{ quotations, customers, createQuotation, updateQuotation, addCustomer }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployee() {
  const context = useContext(EmployeeContext)
  if (!context) {
    throw new Error("useEmployee must be used within EmployeeProvider")
  }
  return context
}
