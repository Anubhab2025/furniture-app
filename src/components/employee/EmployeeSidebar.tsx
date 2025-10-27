"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/src/contexts/AuthContext"
import { Home, FileText, History, Users, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function EmployeeSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/staff", icon: Home, label: "Dashboard" },
    { href: "/staff/create-quotation", icon: FileText, label: "Create Quotation" },
    { href: "/staff/history", icon: History, label: "History" },
    { href: "/staff/customers", icon: Users, label: "Customers" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-white/20"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 h-screen bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-lg flex flex-col overflow-hidden
        md:relative md:translate-x-0 md:z-auto
        fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Furniture Co.
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Sales Staff</p>
          </div>

          <nav className="flex-1 px-3 pb-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-200 text-sm md:text-base w-full ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`w-4 h-4 md:w-5 md:h-5 mr-3 transition-transform flex-shrink-0 ${isActive(item.href) ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="px-3 pb-6 mt-auto">
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  logout()
                  closeMobileMenu()
                }}
                className="w-full flex items-center justify-center px-3 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 gap-2 text-sm md:text-base"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}