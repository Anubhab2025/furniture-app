"use client"

import { useCustomer } from "@/src/contexts/CustomerContext"
import Link from "next/link"

export default function CustomerHome() {
  const { quotations } = useCustomer()

  const approvedCount = quotations.filter((q) => q.status === "approved").length
  const pendingCount = quotations.filter((q) => q.status === "sent").length
  const totalValue = quotations.reduce((sum, q) => sum + q.total, 0)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Welcome to Your Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Quotations</p>
          <p className="text-3xl font-bold text-foreground">{quotations.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
          <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Approved</p>
          <p className="text-3xl font-bold text-foreground">{approvedCount}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-4">View Your Quotations</h2>
        <p className="text-muted-foreground mb-6">Review, approve, or request changes to your quotations</p>
        <Link
          href="/customer/quotations"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold"
        >
          Go to Quotations
        </Link>
      </div>
    </div>
  )
}
