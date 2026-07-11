"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, MessageSquare, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import EmptyState from "@/components/admin/EmptyState";
import { getAdminClient } from "@/lib/supabase-admin";
import type { ContactMessage, ContactStatus } from "@/types/admin";

const STATUS_OPTIONS = [
  { value: "",        label: "All Statuses" },
  { value: "new",     label: "New"          },
  { value: "read",    label: "Read"         },
  { value: "replied", label: "Replied"      },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function ContactsPage() {
  const [rows,    setRows]    = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();
    let q = db.from("contacts").select("*").order("created_at", { ascending: false });
    if (status) q = q.eq("status", status);
    const { data } = await q;
    setRows((data ?? []) as ContactMessage[]);
    setLoading(false);
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">{rows.length} total messages</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] bg-white text-gray-700 cursor-pointer"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No messages found" description="Try adjusting your filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 text-left">
                  {["Sender", "Subject", "Phone", "Date", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.email}</div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <div className="text-sm text-gray-700 truncate">{r.subject}</div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">{r.message.slice(0, 60)}…</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{r.phone ?? "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={r.status as ContactStatus} type="contact" />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/contacts/${r.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#0057D9] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                      >
                        View <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
