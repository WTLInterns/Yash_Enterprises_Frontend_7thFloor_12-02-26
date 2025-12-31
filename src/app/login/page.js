"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@yashenterprises.com";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // If already logged in, go to dashboard
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        router.replace("/");
      }
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", "admin-session");
      }
      router.replace("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Yash Enterprises Admin</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to access the dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Sign in
          </button>

          <p className="mt-4 text-xs text-slate-500">
            Admin login for development only. Use:<br />
            <span className="font-mono">{ADMIN_EMAIL}</span> / <span className="font-mono">{ADMIN_PASSWORD}</span>
          </p>
        </form>
      </div>
    </div>
  );
}
