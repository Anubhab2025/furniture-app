"use client"

import { useAdmin } from "@/src/contexts/AdminContext"

export default function EmployeesPage() {
  const { employees } = useAdmin()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Employees</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition">
          Add Employee
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Name</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Email</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Role</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Quotations</th>
              <th className="text-left py-3 px-6 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-border hover:bg-muted transition">
                <td className="py-4 px-6 text-foreground font-medium">{emp.name}</td>
                <td className="py-4 px-6 text-foreground">{emp.email}</td>
                <td className="py-4 px-6 text-foreground">{emp.role}</td>
                <td className="py-4 px-6">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    {emp.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-foreground">{emp.quotations}</td>
                <td className="py-4 px-6">
                  <button className="text-primary hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
