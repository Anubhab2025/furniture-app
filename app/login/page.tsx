"use client";

import React, { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setTimeout(() => router.push("/"), 300);
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: "admin" | "employee") => {
    const credentials = {
      admin: { email: "admin@furniture.com", password: "admin123" },
      employee: { email: "employee@furniture.com", password: "emp123" },
    } as const;
    const creds = credentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-purple-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-center mb-8">Curioushues Portal Login</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-700 placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Demo Accounts Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Demo Accounts:
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="w-full text-left px-4 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
            >
              Admin: admin@furniture.com
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("employee")}
              className="w-full text-left px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all"
            >
              Employee: employee@furniture.com
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Passwords: <b>admin123</b> (admin), <b>emp123</b> (employee)
          </p>
        </div>
      </div>
    </div>
  );
}
