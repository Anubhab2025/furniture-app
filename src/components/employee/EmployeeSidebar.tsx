"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { Home, FileText, History, Users, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function EmployeeSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const toggle = () => setMobileOpen(v => !v);
  const close = () => setMobileOpen(false);

  const navItems = [
    { href: "/staff", icon: Home, label: "Dashboard" },
    { href: "/staff/customers", icon: Users, label: "Customers" },
  //  { href: "/staff/create-quotation", icon: FileText, label: "Create Quotation" },
    { href: "/staff/history", icon: History, label: "History" },
  ];

  return (
    <>
      {/* ───── Mobile menu button ───── */}
      <button
        onClick={toggle}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="fixed top-4 left-1 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 md:hidden"
      >
        {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
      </button>

      {/* ───── Mobile backdrop ───── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ───── Sidebar ───── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col w-56 h-screen
          bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg
          transition-all duration-300 ease-in-out transform
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:relative
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Furniture Co.
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Sales Staff</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`
                    group flex items-center w-full rounded-xl px-3 py-3 text-sm md:text-base transition-all duration-200
                    ${isActive(item.href)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0 transition-transform
                      ${isActive(item.href) ? "scale-110" : "group-hover:scale-110"}
                    `}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-100 px-3 pb-30 pt-4 mt-auto">
            <button
              onClick={() => { logout(); close(); }}
              className={`
                flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600
                px-3 py-3 text-white font-medium text-sm md:text-base shadow-md
                hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5
                transition-all duration-200
              `}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}