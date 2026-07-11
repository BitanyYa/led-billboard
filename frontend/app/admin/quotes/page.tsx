"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Filter, FileText, ArrowRight,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { SkeletonRow } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";
import { getAdminClient } from "@/lib/supabase-admin";
import type { QuoteRequest, QuoteStatus } from "@/types/admin";
import { PACKAGE_LABELS, PACKAGE_PRICES, QUOTE_STATUS_CONFIG } from "@/types/admin";

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
  { value: "",                 label: "All Statuses"          },
  { value: "pending",          label: "Pending"               },
  { value: "under_review",     label: "Under Review"          },
  { value: "waiting_customer", label: "Waiting for Customer"  },
  { value: "waiting_payment",  label: "Waiting for Payment"   },
  { value: "approved",         label: "Approved"              },
  { value: "rejected",         label: "Rejected"              },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short", day: "numeric", year: "numeric",
  });
}

type SortDir = "desc" | "asc";

export default function QuotesPage() {
  const [rows,    setRows]    = useState<QuoteRequest[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("");
  const [sort,    setSort]    = useState<SortDir>("desc");
  const [page,    setPage]    = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();

    let q = db
      .from("quote_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: sort === "asc" })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (status) q = q.eq("status", status);

    // Server-side search on reference number; client handles the rest
    const { data, count } = await q;
    setRows((data ?? []) as QuoteRequest[]);
    setTotal(count ?? 0);
    setLoading(false);
  }, [status, sort, page]);

  useEffect(() => { load(); }, [load]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [status, sort, search]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      (r.phone ?? "").toLowerCase().includes(s) ||
      (r.company_name ?? "").toLowerCase().includes(s) ||
      r.reference_number.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const toggleSort = () => setSort((s) => (s === "desc" ? "asc" : "desc"));

  const SortIcon = sort === "desc" ? ArrowDown : ArrowUp;

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Quote Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total} total · page {page} of {Math.max(1, totalPages)}
          </p>
        </div>

        {/* Status summary pills */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(QUOTE_STATUS_CONFIG) as QuoteStatus[]).map((s) => {
            const cfg = QUOTE_STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setStatus(status === s ? "" : s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                style={status === s
                  ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                  : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#6B7280" }}
              >
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, company, phone, email, reference…"
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
        <button
          onClick={toggleSort}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#0057D9] hover:text-[#0057D9] transition-all bg-white whitespace-nowrap"
        >
          <SortIcon size={14} />
          {sort === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div>
            <div className="grid grid-cols-8 px-5 py-3.5 border-b border-gray-50 gap-4">
              {["Reference", "Customer", "Company", "Package", "Phone", "Email", "Date", "Status"].map((h) => (
                <div key={h} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</div>
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={8} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No quote requests found" description="Try adjusting your search or filters" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 text-left bg-gray-50/40">
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Package</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <button onClick={toggleSort} className="flex items-center gap-1 hover:text-gray-600">
                    Date <SortIcon size={12} />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  {/* Reference */}
                  <td className="px-4 py-3.5">
                    <code className="text-xs bg-[#0057D9]/8 text-[#0057D9] font-mono font-bold px-2 py-1 rounded-lg">
                      {r.reference_number}
                    </code>
                  </td>

                  {/* Customer + Company */}
                  <td className="px-4 py-3.5 max-w-[160px]">
                    <div className="font-semibold text-gray-900 text-sm truncate">{r.full_name}</div>
                    {r.company_name && (
                      <div className="text-xs text-gray-400 truncate">{r.company_name}</div>
                    )}
                  </td>

                  {/* Phone + Email */}
                  <td className="px-4 py-3.5 max-w-[160px]">
                    <div className="text-sm text-gray-700 truncate">{r.phone}</div>
                    <div className="text-xs text-gray-400 truncate">{r.email}</div>
                  </td>

                  {/* Package */}
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-medium text-gray-800">{PACKAGE_LABELS[r.package]}</div>
                    <div className="text-xs text-gray-400">{PACKAGE_PRICES[r.package]}</div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 text-sm text-gray-500">{fmt(r.created_at)}</td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.status} type="quote" />
                  </td>

                  {/* View link */}
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/quotes/${r.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#0057D9] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                    >
                      View <ArrowRight size={11} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === p
                        ? "bg-[#0057D9] text-white shadow-sm"
                        : "border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
