"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatDateTime } from "@/utils/helpers";

function statusVariant(status) {
  if (status === "IN") return "success";
  if (status === "OUT") return "danger";
  return "default";
}

export default function EmployeesTable({ employees = [] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return employees.filter((e) => {
      const matchesQuery =
        !q ||
        (e.name || "").toLowerCase().includes(q) ||
        (e.teamName || "").toLowerCase().includes(q) ||
        (e.lastLocation || "").toLowerCase().includes(q);

      const matchesStatus = status === "ALL" ? true : e.punchStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [employees, query, status]);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Employees ({employees.length})</div>
          <div className="mt-1 text-xs text-slate-500">Search + filter ready</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter status"
          >
            <option value="ALL">All</option>
            <option value="IN">Punched In</option>
            <option value="OUT">Punched Out</option>
          </select>

          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here"
              className="h-10 w-64 rounded-xl bg-white pl-10 pr-3 text-sm text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  className="stroke-current"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Punch Status</th>
              <th className="hidden px-4 py-3 lg:table-cell">Last Punch</th>
              <th className="hidden px-4 py-3 xl:table-cell">Mode</th>
              <th className="hidden px-4 py-3 xl:table-cell">Last Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filtered.length ? (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-900">{e.name}</div>
                        <div className="truncate text-xs text-slate-500">{e.teamName || "-"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <Badge variant={statusVariant(e.punchStatus)}>{e.punchStatus === "IN" ? "Punched In" : "Punched Out"}</Badge>
                      <div className="text-xs text-slate-500">{e.isActive ? "Active" : "Inactive"}</div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-4 text-slate-700 lg:table-cell">
                    <div className="font-medium text-slate-900">{formatDateTime(e.lastPunchTime)}</div>
                    <div className="text-xs text-slate-500">Last update</div>
                  </td>

                  <td className="hidden px-4 py-4 xl:table-cell">
                    <Badge variant={e.punchMode === "AUTO" ? "info" : "default"}>{e.punchMode || "-"}</Badge>
                  </td>

                  <td className="hidden px-4 py-4 text-slate-600 xl:table-cell">
                    <div className="max-w-[420px] truncate">{e.lastLocation || "-"}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-10">
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <div className="text-sm font-semibold text-slate-900">No employees found</div>
                    <div className="mt-1 text-xs text-slate-500">Try changing search or status filter.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
