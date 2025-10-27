"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"
import { BarChart3, Users, FileText, Package, Search, LogOut } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-lg p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Furniture Co.
        </h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="space-y-1 mb-auto">
        <Link
          href="/admin"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <BarChart3 className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin") ? "scale-110" : "group-hover:scale-110"}`} />
          Dashboard
        </Link>
        <Link
          href="/admin/employees"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/employees")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Users className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin/employees") ? "scale-110" : "group-hover:scale-110"}`} />
          Employees
        </Link>
        <Link
          href="/admin/customers"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/customers")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Users className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin/customers") ? "scale-110" : "group-hover:scale-110"}`} />
          Customers
        </Link>
        <Link
          href="/admin/quotations"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/quotations")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <FileText className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin/quotations") ? "scale-110" : "group-hover:scale-110"}`} />
          Quotations
        </Link>
        <Link
          href="/admin/catalog"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/catalog")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Package className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin/catalog") ? "scale-110" : "group-hover:scale-110"}`} />
          Catalog
        </Link>
        <Link
          href="/admin/search"
          className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive("/admin/search")
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Search className={`w-5 h-5 mr-3 transition-transform ${isActive("/admin/search") ? "scale-110" : "group-hover:scale-110"}`} />
          Search
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100">
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