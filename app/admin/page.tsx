"use client"

import { useAdmin } from "@/src/contexts/AdminContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"

export default function AdminDashboard() {
  const { customers, products, employees } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")

  const monthlyData = [
    { month: "Jan", quotations: 12, conversions: 8 },
    { month: "Feb", quotations: 19, conversions: 14 },
    { month: "Mar", quotations: 15, conversions: 11 },
    { month: "Apr", quotations: 25, conversions: 18 },
    { month: "May", quotations: 22, conversions: 16 },
    { month: "Jun", quotations: 28, conversions: 22 },
  ]

  const topProducts = [
    { name: "Modern Sofa", sales: 8 },
    { name: "Dining Table", sales: 6 },
    { name: "Office Chair", sales: 12 },
    { name: "King Bed", sales: 4 },
  ]

  const categoryData = [
    { name: "Sofa", value: 35 },
    { name: "Table", value: 25 },
    { name: "Chair", value: 20 },
    { name: "Bed", value: 20 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Customers</p>
          <p className="text-3xl font-bold text-foreground">{customers.length}</p>
          <p className="text-xs text-muted-foreground mt-2">+2 this month</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Products</p>
          <p className="text-3xl font-bold text-foreground">{products.length}</p>
          <p className="text-xs text-muted-foreground mt-2">All categories</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Employees</p>
          <p className="text-3xl font-bold text-foreground">{employees.length}</p>
          <p className="text-xs text-muted-foreground mt-2">All active</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Sales</p>
          <p className="text-3xl font-bold text-foreground">₹2.4L</p>
          <p className="text-xs text-muted-foreground mt-2">+15% vs last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Monthly Quotations & Conversions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quotations" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Top Products by Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Employee Performance</h2>
          <div className="space-y-4">
            {employees.map((emp) => (
              <div key={emp.id} className="pb-4 border-b border-border last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">{emp.name}</span>
                  <span className="text-sm font-semibold text-primary">{emp.conversionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${emp.conversionRate}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{emp.quotations} quotations</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Customer List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Customer Search & Overview</h2>
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />

        {filteredCustomers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Phone</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Tags</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-4 text-foreground font-medium">{customer.name}</td>
                    <td className="py-3 px-4 text-foreground text-xs">{customer.email}</td>
                    <td className="py-3 px-4 text-foreground text-xs">{customer.phone}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {customer.tags.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground text-xs">
                      {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
