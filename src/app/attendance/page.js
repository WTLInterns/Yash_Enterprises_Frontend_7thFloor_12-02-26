"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { backendApi } from "@/services/api";

// For now, use a fixed employeeId (e.g. 1). Later this can come from auth/user context.
const EMPLOYEE_ID = 1;

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Date range: last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const from = formatDate(sevenDaysAgo);
  const to = formatDate(today);

  async function loadAttendance() {
    try {
      setLoading(true);
      setError("");
      const data = await backendApi.get(`/attendance/${EMPLOYEE_ID}?from=${from}&to=${to}`);
      setRecords(data || []);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function punch(status) {
    try {
      setError("");
      const now = new Date().toISOString();

      const payload = {
        employeeId: EMPLOYEE_ID,
        date: formatDate(new Date()),
        status,
        // Use punchInTime or punchOutTime based on status
        punchInTime: status === "IN" ? now : null,
        punchOutTime: status === "OUT" ? now : null,
      };

      await backendApi.post("/attendance/punch-in", payload);
      await loadAttendance();
    } catch (err) {
      console.error("Failed to punch", err);
      setError("Failed to punch. Please try again.");
    }
  }

  return (
    <DashboardLayout
      header={{
        project: "Attendance",
        user: { name: "Admin User", role: "Administrator" },
        notifications: [],
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Employee Attendance</h1>
            <p className="mt-1 text-xs text-slate-500">
              Showing records for employee #{EMPLOYEE_ID} from {from} to {to}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => punch("IN")}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Punch In
            </button>
            <button
              onClick={() => punch("OUT")}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Punch Out
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent Attendance</h2>
          </div>

          {loading ? (
            <div className="py-6 text-sm text-slate-500">Loading...</div>
          ) : records.length === 0 ? (
            <div className="py-6 text-sm text-slate-500">No attendance records for this period.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Punch In</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Punch Out</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-700">
                        {r.date}
                      </td>
                      <td className="px-4 py-2 text-slate-700 text-xs">
                        {r.punchInTime ? new Date(r.punchInTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-2 text-slate-700 text-xs">
                        {r.punchOutTime ? new Date(r.punchOutTime).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {r.status || "-"}
                      </td>
                      <td className="px-4 py-2 text-slate-400 text-xs max-w-[200px] truncate">
                        {r.note || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
