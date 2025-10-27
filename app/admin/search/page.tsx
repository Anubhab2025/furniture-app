"use client"

import { useAdmin } from "@/src/contexts/AdminContext"
import { useState } from "react"

export default function SearchPage() {
  const { customers, products, employees } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"all" | "customers" | "products" | "employees">("all")

  const searchCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  )

  const searchProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const searchEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm),
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Advanced Search</h1>

      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <input
          type="text"
          placeholder="Search across all data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-lg"
          autoFocus
        />

        <div className="flex gap-2 flex-wrap">
          {(["all", "customers", "products", "employees"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-4 py-2 rounded-lg transition ${
                searchType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {searchTerm === "" ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to get started</p>
        </div>
      ) : (
        <>
          {/* Customers */}
          {(searchType === "all" || searchType === "customers") && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Customers ({searchCustomers.length})</h2>
              {searchCustomers.length === 0 ? (
                <p className="text-muted-foreground">No customers found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchCustomers.map((customer) => (
                    <div key={customer.id} className="bg-card border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-2">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{customer.email}</p>
                      <p className="text-sm text-muted-foreground mb-3">{customer.phone}</p>
                      <div className="flex gap-1 flex-wrap">
                        {customer.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products */}
          {(searchType === "all" || searchType === "products") && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Products ({searchProducts.length})</h2>
              {searchProducts.length === 0 ? (
                <p className="text-muted-foreground">No products found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchProducts.map((product) => (
                    <div key={product.id} className="bg-card border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-1">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="text-lg font-bold text-primary mb-2">₹{product.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Employees */}
          {(searchType === "all" || searchType === "employees") && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Employees ({searchEmployees.length})</h2>
              {searchEmployees.length === 0 ? (
                <p className="text-muted-foreground">No employees found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchEmployees.map((employee) => (
                    <div key={employee.id} className="bg-card border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-1">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{employee.role}</p>
                      <p className="text-sm text-muted-foreground mb-3">{employee.email}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Quotations: {employee.quotations}</span>
                        <span className="text-primary font-semibold">{employee.conversionRate}% conversion</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
