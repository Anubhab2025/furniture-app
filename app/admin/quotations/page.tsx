"use client"

import { DUMMY_QUOTATIONS } from "@/src/utils/dummy-data"
import { useState } from "react"

export default function QuotationsPage() {
  const [quotations] = useState(DUMMY_QUOTATIONS)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">All Quotations</h1>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">ID</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Customer</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Amount</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Date</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quot) => (
              <tr key={quot.id} className="border-b border-border hover:bg-muted transition">
                <td className="py-4 px-6 text-foreground font-mono text-sm">{quot.id}</td>
                <td className="py-4 px-6 text-foreground">Customer {quot.customerId}</td>
                <td className="py-4 px-6 text-foreground font-semibold">₹{quot.total.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quot.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : quot.status === "sent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {quot.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-foreground text-sm">{new Date(quot.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <button className="text-primary hover:underline text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
