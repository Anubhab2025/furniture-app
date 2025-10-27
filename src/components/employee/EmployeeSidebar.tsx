"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"
import { Home, FileText, History, Users, LogOut } from "lucide-react" // Assuming lucide-react for icons

export function EmployeeSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-lg flex flex-col p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Furniture Co.
        </h1>
        <p className="text-sm text-gray-500 mt-1">Sales Staff</p>
      </div>

      <nav className="space-y-1 flex-1 mb-6">
        <Link
          href="/staff"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/staff")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Home className={`w-5 h-5 mr-3 transition-transform ${isActive("/staff") ? "scale-110" : "group-hover:scale-110"}`} />
          Dashboard
        </Link>
        <Link
          href="/staff/create-quotation"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/staff/create-quotation")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FileText className={`w-5 h-5 mr-3 transition-transform ${isActive("/staff/create-quotation") ? "scale-110" : "group-hover:scale-110"}`} />
          Create Quotation
        </Link>
        <Link
          href="/staff/history"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/staff/history")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <History className={`w-5 h-5 mr-3 transition-transform ${isActive("/staff/history") ? "scale-110" : "group-hover:scale-110"}`} />
          History
        </Link>
        <Link
          href="/staff/customers"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/staff/customers")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Users className={`w-5 h-5 mr-3 transition-transform ${isActive("/staff/customers") ? "scale-110" : "group-hover:scale-110"}`} />
          Customers
        </Link>
      </nav>

      <div className="border-t border-gray-100 pt-6">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}