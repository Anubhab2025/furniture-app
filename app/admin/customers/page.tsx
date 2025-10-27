"use client"

import { useAdmin } from "@/src/contexts/AdminContext"
import { useState } from "react"

export default function CustomersPage() {
  const { customers } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition">
          Add Customer
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div key={customer.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-foreground mb-2">{customer.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
            <p className="text-sm text-muted-foreground mb-4">{customer.phone}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {customer.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <button className="text-primary hover:underline text-sm">View Details</button>
          </div>
        ))}
      </div>
    </div>
  )
}
