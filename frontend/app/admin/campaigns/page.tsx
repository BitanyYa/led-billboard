"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Filter, Megaphone, ArrowRight,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { SkeletonRow } from "@/components/admin/Skeleton";
import EmptyState from "@/components/admin/EmptyState";
import { getAdminClient } from "@/lib/supabase-admin";
import type { Campaign, CampaignStatus, PaymentStatus } from "@/types/admin";
import { CAMPAIGN_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, PACKAGE_LABELS } from "@/types/admin";

const PAGE_SIZE = 15;

type SortDir = "desc" | "asc";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" });
}

export default function CampaignsPage() {
  const [rows,    setRows]    = useState<Campaign[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("");
  const [paymentStatusFilter,  setPaymentStatusFilter]  = useState("");
  const [sort,    setSort]    = useState<SortDir>("desc");
  const [page,    setPage]    = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();

    let q = db
      .from("campaigns")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: sort === "asc" })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (campaignStatusFilter) q = q.eq("campaign_status", campaignStatusFilter);
    if (paymentStatusFilter)  q = q.eq("payment_status",  paymentStatusFilter);

    const { data, count } = await q;
    setRows((data ?? []) as Campaign[]);
    setTotal(count ?? 0);
    setLoading(false);
  }, [campaignStatusFilter, paymentStatusFilter, sort, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [campaignStatusFilter, paymentStatusFilter, sort, search]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.customer_name.toLowerCase().includes(s) ||
      r.campaign_number.toLowerCase().includes(s) ||
      r.reference_number.toLowerCase().includes(s) ||
      (r.company ?? "").toLowerCase().includes(s) ||
      (r.assigned_operator ?? "").toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const SortIcon   = sort === "desc" ? ArrowDown : ArrowUp;

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total} total · page {page} of {Math.max(1, totalPages)}
          </p>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CAMPAIGN_STATUS_CONFIG) as CampaignStatus[]).map((s) => {
            const cfg = CAMPAIGN_STATUS_CONFIG[s];
            const active = campaignStatusFilter === s;
            return (
              <button key={s}
                onClick={() => setCampaignStatusFilter(active ? "" : s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                style={active
                  ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                  : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#6B7280" }}>
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
          <input type="text" placeholder="Search name, company, campaign #, reference…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all" />
        </div>

        {/* Payment status filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] bg-white text-gray-700 cursor-pointer">
            <option value="">All Payments</option>
            {(Object.keys(PAYMENT_STATUS_CONFIG) as PaymentStatus[]).map((s) => (
              <option key={s} value={s}>{PAYMENT_STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>

        <button onClick={() => setSort((s) => s === "desc" ? "asc" : "desc")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#0057D9] hover:text-[#0057D9] transition-all bg-white whitespace-nowrap">
          <SortIcon size={14} /> {sort === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div>
            <div className="grid grid-cols-8 px-5 py-3.5 border-b border-gray-50 gap-4">
              {["Campaign #", "Customer", "Package", "Operator", "Dates", "Payment", "Status", ""].map((h) => (
                <div key={h} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</div>
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={8} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Megaphone} title="No campaigns found"
            description="Campaigns are created when a quote request is approved" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 text-left bg-gray-50/40">
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Campaign #</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Package</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Operator</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <button onClick={() => setSort((s) => s === "desc" ? "asc" : "desc")}
                    className="flex items-center gap-1 hover:text-gray-600">
                    Created <SortIcon size={12} />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/60 transition-colors group">

                  {/* Campaign # + Reference */}
                  <td className="px-4 py-3.5">
                    <code className="text-xs bg-[#0057D9]/8 text-[#0057D9] font-mono font-bold px-2 py-1 rounded-lg block mb-1">
                      {r.campaign_number}
                    </code>
                    <span className="text-xs text-gray-400">{r.reference_number}</span>
                  </td>

                  {/* Customer + Company */}
                  <td className="px-4 py-3.5 max-w-[150px]">
                    <div className="font-semibold text-gray-900 text-sm truncate">{r.customer_name}</div>
                    {r.company && <div className="text-xs text-gray-400 truncate">{r.company}</div>}
                  </td>

                  {/* Package */}
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-medium text-gray-800">{PACKAGE_LABELS[r.package]}</div>
                    <div className="text-xs text-gray-400">{r.business_category}</div>
                  </td>

                  {/* Operator */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-gray-600">{r.assigned_operator ?? <span className="text-gray-300">Unassigned</span>}</span>
                  </td>

                  {/* Created date */}
                  <td className="px-4 py-3.5">
                    <div className="text-sm text-gray-500">{fmt(r.created_at)}</div>
                    {(r.start_date || r.end_date) && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {fmtDate(r.start_date)} – {fmtDate(r.end_date)}
                      </div>
                    )}
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.payment_status} type="payment" />
                  </td>

                  {/* Campaign status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.campaign_status} type="campaign" />
                  </td>

                  {/* View link */}
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/campaigns/${r.id}`}
                      className="inline-flex items-center gap-1 text-xs text-[#0057D9] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
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
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === p ? "bg-[#0057D9] text-white shadow-sm"
                        : "border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9]"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#0057D9] hover:text-[#0057D9] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
