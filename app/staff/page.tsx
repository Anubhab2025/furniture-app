"use client";

import { useEmployee } from "@/src/contexts/EmployeeContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StaffDashboard() {
  const { quotations } = useEmployee();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter logic
  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayQuotations = quotations.filter(
    (q) => new Date(q.createdAt).toDateString() === new Date().toDateString()
  );
  const pendingQuotations = quotations.filter((q) => q.status === "draft");
  const sentQuotations = quotations.filter((q) => q.status === "sent");
  const approvedQuotations = quotations.filter((q) => q.status === "approved");
  const rejectedQuotations = quotations.filter((q) => q.status === "rejected");

  const totalRevenue = quotations.reduce((sum, q) => sum + q.total, 0);
  const monthlyRevenue = quotations
    .filter((q) => new Date(q.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, q) => sum + q.total, 0);

  const conversionRate =
    quotations.length > 0
      ? ((approvedQuotations.length / quotations.length) * 100).toFixed(1)
      : 0;

  const recentActivities = quotations
    .filter((q) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(q.createdAt) > sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const quickActions = [
    {
      label: "Create Quotation",
      icon: "Create",
      href: "/staff/create-quotation",
      color: "from-blue-500 to-purple-600",
    },
    {
      label: "View Customers",
      icon: "Customers",
      href: "/staff/customers",
      color: "from-green-500 to-teal-600",
    },
    {
      label: "Templates",
      icon: "Templates",
      href: "/staff/templates",
      color: "from-orange-500 to-red-600",
    },
    {
      label: "Reports",
      icon: "Reports",
      href: "/staff/reports",
      color: "from-purple-500 to-pink-600",
    },
  ];

  // Responsive container classes
  const containerClass =
    "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8";
  const innerClass = "max-w-7xl mx-auto";

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm md:text-base">
                  Profile
                </span>
                Welcome, {user?.name}
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-1">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                •{" "}
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4 shadow-sm text-right">
              <p className="text-xs md:text-sm text-slate-600">Employee ID</p>
              <p className="font-semibold text-slate-900">
                {user?.employeeId || "EMP001"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
          {[
            {
              label: "Today's Quotations",
              value: todayQuotations.length,
            },
            {
              label: "Pending Drafts",
              value: pendingQuotations.length,
            },
            {
              label: "Sent",
              value: sentQuotations.length,
            },
            {
              label: "Approved",
              value: approvedQuotations.length,
            },
            {
              label: "Rejected",
              value: rejectedQuotations.length,
            },
            {
              label: "Monthly Revenue",
              value: `₹${monthlyRevenue.toLocaleString()}`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <div>
                <p className="text-xs md:text-sm text-slate-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-xl md:text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Quotations */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden mb-6 md:mb-8">
          <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-xl">Document</span> Recent Quotations
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Showing</span>
              <span className="font-semibold text-slate-900">
                {Math.min(filteredQuotations.length, 10)}
              </span>
              <span className="text-slate-600">
                of {filteredQuotations.length}
              </span>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "ID",
                    "Customer",
                    "Amount",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.slice(0, 10).map((quot, i) => (
                  <tr
                    key={quot.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      {quot.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {quot.customerId[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            Customer {quot.customerId}
                          </div>
                          <div className="text-xs text-slate-600">
                            {quot.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-1">
                      <span className="text-lg">Money</span> ₹
                      {quot.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={quot.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                      <span className="text-lg">Clock</span>{" "}
                      {new Date(quot.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs border border-slate-300 rounded-md bg-white hover:bg-slate-100 transition">
                          View
                        </button>
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-3">
            {filteredQuotations.slice(0, 10).map((quot) => (
              <div
                key={quot.id}
                className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono font-semibold text-slate-900">
                    {quot.id}
                  </div>
                  <StatusBadge status={quot.status} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {quot.customerId[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Customer {quot.customerId}
                    </div>
                    <div className="text-xs text-slate-600">
                      {quot.email || "No email"}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 font-medium text-slate-900">
                    <span>Money</span> ₹{quot.total.toLocaleString()}
                  </div>
                  <div className="text-slate-600 flex items-center gap-1">
                    <span>Clock</span>{" "}
                    {new Date(quot.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 text-xs border border-slate-300 rounded-md bg-white hover:bg-slate-100 transition">
                    View
                  </button>
                  <button className="flex-1 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredQuotations.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="text-5xl mb-4">Document</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {quotations.length === 0
                  ? "No quotations yet"
                  : "No quotations found"}
              </h3>
              <p className="text-slate-600 mb-6">
                {quotations.length === 0
                  ? "Get started by creating your first quotation."
                  : "Try adjusting your search or filter criteria."}
              </p>
              <Link
                href="/staff/create-quotation"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-lg font-medium hover:scale-105 transition"
              >
                Create Create Quotation
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentActivities.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-200">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-xl">Refresh</span> Recent Activity (Last 7
                Days)
              </h2>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              {recentActivities.slice(0, 5).map((activity, i) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-3 pb-4 ${
                    i < 4 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                    {activity.status === "draft" && "Create"}
                    {activity.status === "sent" && "Send"}
                    {activity.status === "approved" && "Check"}
                    {activity.status === "rejected" && "Cross"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm md:text-base">
                      Quotation {activity.id}{" "}
                      {activity.status === "sent"
                        ? "sent to"
                        : activity.status === "approved"
                        ? "approved for"
                        : activity.status === "rejected"
                        ? "rejected for"
                        : "created for"}{" "}
                      Customer {activity.customerId}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="font-semibold text-slate-900">
                    ₹{activity.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: string }> = {
    draft: { bg: "bg-amber-100", text: "text-amber-800", icon: "Clock" },
    sent: { bg: "bg-blue-100", text: "text-blue-800", icon: "Send" },
    approved: { bg: "bg-green-100", text: "text-green-800", icon: "Check" },
    rejected: { bg: "bg-red-100", text: "text-red-800", icon: "Cross" },
  };

  const s = styles[status] || styles.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
    >
      {s.icon} {status}
    </span>
  );
}
