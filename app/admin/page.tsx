"use client";

import { useAdmin } from "@/src/contexts/AdminContext";
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
} from "recharts";
import { useState, useMemo } from "react";
import {
  Search,
  Users,
  Package,
  Send,
  CheckCircle,
  TrendingUp,
  Filter,
} from "lucide-react";

export default function AdminDashboard() {
  const { customers, products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

  // Employee data with Indian names
  const employees = [
    { id: "emp1", name: "Aarav Patel", conversionRate: 78, quotations: 45 },
    { id: "emp2", name: "Priya Sharma", conversionRate: 85, quotations: 52 },
    { id: "emp3", name: "Rahul Gupta", conversionRate: 65, quotations: 38 },
    { id: "emp4", name: "Ananya Reddy", conversionRate: 92, quotations: 60 },
    { id: "emp5", name: "Vikram Singh", conversionRate: 70, quotations: 48 },
    { id: "emp6", name: "Meera Iyer", conversionRate: 88, quotations: 55 },
    { id: "emp7", name: "Arjun Kumar", conversionRate: 75, quotations: 42 },
    { id: "emp8", name: "Ishaan Joshi", conversionRate: 80, quotations: 50 },
    { id: "emp9", name: "Neha Desai", conversionRate: 82, quotations: 53 },
    { id: "emp10", name: "Rohan Malhotra", conversionRate: 68, quotations: 40 },
  ];

  // Base monthly data structure
  const baseMonthlyData = [
    { month: "Jan", sent: 15, marked: 12 },
    { month: "Feb", sent: 22, marked: 19 },
    { month: "Mar", sent: 18, marked: 15 },
    { month: "Apr", sent: 30, marked: 25 },
    { month: "May", sent: 26, marked: 22 },
    { month: "Jun", sent: 35, marked: 28 },
  ];

  // Generate employee-specific data
  const employeeMonthlyData = useMemo(() => {
    return employees.flatMap((emp) =>
      baseMonthlyData.map((m) => ({
        ...m,
        sent: Math.floor(Math.random() * 15) + 5,
        marked: Math.floor(Math.random() * 12) + 3,
        employee: emp.id,
      }))
    );
  }, [employees]);

  // Chart data based on selected employee
  const chartData = useMemo(() => {
    return selectedEmployee === "all"
      ? baseMonthlyData
      : employeeMonthlyData.filter((d) => d.employee === selectedEmployee);
  }, [selectedEmployee, employeeMonthlyData]);

  const topProducts = [
    { name: "Modern Sofa", sales: 8 },
    { name: "Dining Table", sales: 6 },
    { name: "Office Chair", sales: 12 },
    { name: "King Bed", sales: 4 },
  ];

  const categoryData = [
    { name: "Sofa", value: 35 },
    { name: "Table", value: 25 },
    { name: "Chair", value: 20 },
    { name: "Bed", value: 20 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>

          {/* Employee Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +2
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Customers
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {customers.length}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                All
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Products
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {products.length}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sent Quotations
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {baseMonthlyData.reduce((a, b) => a + b.sent, 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                +15%
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Maked Quotations
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {baseMonthlyData.reduce((a, b) => a + b.marked, 0)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <span className="truncate">Sent vs Marked Quotations</span>
            </h2>
            <div className="w-full h-[220px] sm:h-[280px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: "0.7rem", fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    interval={window.innerWidth < 640 ? "preserveEnd" : 0}
                  />
                  <YAxis
                    tick={{ fontSize: "0.7rem", fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      padding: "6px 10px",
                      fontSize: "11px",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      marginBottom: 4,
                      fontSize: "0.7rem",
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      name === "sent" ? "Sent" : "Marked",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "8px",
                      fontSize: "0.7rem",
                    }}
                    formatter={(value) => (
                      <span style={{ color: "#475569" }}>
                        {value === "sent" ? "Sent" : "Marked"}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#8b5cf6"
                    strokeWidth={2.3}
                    dot={{
                      fill: "#8b5cf6",
                      r: window.innerWidth < 640 ? 2.5 : 3.5,
                      strokeWidth: 1.5,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name="sent"
                  />
                  <Line
                    type="monotone"
                    dataKey="marked"
                    stroke="#10b981"
                    strokeWidth={2.3}
                    dot={{
                      fill: "#10b981",
                      r: window.innerWidth < 640 ? 2.5 : 3.5,
                      strokeWidth: 1.5,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name="marked"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Top Products by Sales
            </h2>
            <div className="w-full h-[280px] sm:h-[300px] lg:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 60,
                  }}
                  barSize={32}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 10,
                      fill: "currentColor",
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "currentColor",
                    }}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#1e293b",
                    }}
                    formatter={(value) => [`${value} sales`, "Sales"]}
                    labelStyle={{
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      {/* ────────────────────── Pie Chart – Sales by Category ────────────────────── */}
<div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
    Sales by Category
  </h2>

  <div className="relative w-full" style={{ height: "300px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={window.innerWidth < 640 ? "45%" : "55%"}
          outerRadius={window.innerWidth < 640 ? "75%" : "80%"}
          paddingAngle={2}
          dataKey="value"
          // Desktop: label with line, Mobile: no label
          label={window.innerWidth >= 640 ? { position: "outside" } : false}
          labelLine={window.innerWidth >= 640}
          labelStyle={{
            fontSize: "12px",
            fontWeight: "600",
            fill: "currentColor",
          }}
          isAnimationActive={true}
          animationDuration={800}
        >
          {categoryData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
              className="transition-all duration-200 hover:opacity-80 cursor-pointer"
            />
          ))}
        </Pie>

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "13px",
          }}
          formatter={(value: number) => `${value}%`}
        />

        {/* Legend – adapts layout */}
        <Legend
          layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
          verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
          align={window.innerWidth < 640 ? "center" : "right"}
          wrapperStyle={{
            paddingLeft: window.innerWidth < 640 ? "0" : "20px",
            fontSize: "12px",
          }}
          formatter={(value) => (
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

          {/* Employee Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Employee Performance
            </h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {employees.map((emp) => (
                <div key={emp.id} className="pb-3 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                      {emp.name}
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {emp.conversionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${emp.conversionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {emp.quotations} quotations sent
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Search & Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Customer Overview
          </h2>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all"
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-10">
              No customers found
            </p>
          ) : (
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                      Name
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                      Phone
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300">
                      Tags
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                      Last Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.slice(0, 10).map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="py-3 px-2 font-medium text-slate-900 dark:text-white">
                        {customer.name}
                      </td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-300 text-xs hidden sm:table-cell">
                        {customer.email}
                      </td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-300 text-xs hidden md:table-cell">
                        {customer.phone}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1 flex-wrap">
                          {customer.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-300 text-xs hidden lg:table-cell">
                        {customer.lastContact
                          ? new Date(customer.lastContact).toLocaleDateString()
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3 mt-4">
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {customer.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {customer.email}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {customer.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
