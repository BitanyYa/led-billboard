"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  FileText, MessageSquare, CheckCircle2,
  Clock, ArrowRight, Zap, TrendingUp,
  Activity, Calendar,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { SkeletonStatCard, SkeletonRow, SkeletonChart } from "@/components/admin/Skeleton";
import { getAdminClient } from "@/lib/supabase-admin";
import type {
  DashboardStats, QuoteRequest, ContactMessage,
  MonthlyChartPoint, StatusDistributionPoint,
} from "@/types/admin";
import { PACKAGE_LABELS, QUOTE_STATUS_CONFIG } from "@/types/admin";

// Lazy-load charts — avoids SSR issues with recharts
const MonthlyChart = dynamic(
  () => import("@/components/admin/charts/MonthlyChart"),
  { ssr: false, loading: () => <SkeletonChart /> }
);
const StatusDonut = dynamic(
  () => import("@/components/admin/charts/StatusDonut"),
  { ssr: false, loading: () => <SkeletonChart /> }
);

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function buildMonthly(
  quotes:   { created_at: string }[],
  contacts: { created_at: string }[]
): MonthlyChartPoint[] {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  return Array.from({ length: 6 }, (_, offset) => {
    const d   = new Date(now.getFullYear(), now.getMonth() - (5 - offset), 1);
    const mon = months[d.getMonth()];
    const yr  = d.getFullYear();
    const label = yr !== now.getFullYear() ? `${mon} ${yr}` : mon;
    return {
      month:    label,
      quotes:   quotes.filter(q => {
        const qd = new Date(q.created_at);
        return qd.getMonth() === d.getMonth() && qd.getFullYear() === yr;
      }).length,
      contacts: contacts.filter(c => {
        const cd = new Date(c.created_at);
        return cd.getMonth() === d.getMonth() && cd.getFullYear() === yr;
      }).length,
    };
  });
}

function buildStatusDist(quotes: { status: string }[]): StatusDistributionPoint[] {
  const counts: Record<string, number> = {};
  quotes.forEach(q => { counts[q.status] = (counts[q.status] ?? 0) + 1; });
  return (Object.keys(QUOTE_STATUS_CONFIG) as Array<keyof typeof QUOTE_STATUS_CONFIG>)
    .map(key => ({
      name:  QUOTE_STATUS_CONFIG[key].label,
      value: counts[key] ?? 0,
      color: QUOTE_STATUS_CONFIG[key].color,
    }))
    .filter(d => d.value > 0);
}

// ─────────────────────────────────────────────
//  Fade-in wrapper
// ─────────────────────────────────────────────
function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  Table card shell
// ─────────────────────────────────────────────
function TableCard({
  title, sub, href, loading, empty, children,
}: {
  title: string;
  sub?: string;
  href: string;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-50">
        <div>
          <h3 className="font-heading font-bold text-gray-900 text-sm">{title}</h3>
          {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
        </div>
        <Link href={href} className="text-xs text-[#0057D9] font-semibold hover:underline flex items-center gap-1 mt-0.5">
          View all <ArrowRight size={11} />
        </Link>
      </div>
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        : empty
        ? <div className="px-6 py-10 text-center text-gray-400 text-sm">No data yet</div>
        : children
      }
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats,       setStats]       = useState<DashboardStats | null>(null);
  const [quotes,      setQuotes]      = useState<QuoteRequest[]>([]);
  const [contacts,    setContacts]    = useState<ContactMessage[]>([]);
  const [chartQ,      setChartQ]      = useState<{ status: string; created_at: string }[]>([]);
  const [chartC,      setChartC]      = useState<{ created_at: string }[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      const db    = getAdminClient();
      const today = new Date().toISOString().split("T")[0];
      const since = new Date(Date.now() - 180 * 86400 * 1000).toISOString();

      const [
        qTotal, qNew, qContacted, qConfirmed,
        cTotal, cNew,
        qToday, cToday,
        qRecent, cRecent,
        qAll, cAll,
      ] = await Promise.all([
        db.from("quote_requests").select("id", { count: "exact", head: true }),
        db.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
        db.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "contacted"),
        db.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        db.from("contacts").select("id", { count: "exact", head: true }),
        db.from("contacts").select("id", { count: "exact", head: true }).eq("status", "new"),
        db.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", today),
        db.from("contacts").select("id", { count: "exact", head: true }).gte("created_at", today),
        db.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(6),
        db.from("contacts").select("*").order("created_at", { ascending: false }).limit(6),
        db.from("quote_requests").select("status, created_at").gte("created_at", since),
        db.from("contacts").select("created_at").gte("created_at", since),
      ]);

      setStats({
        totalQuotes:        qTotal.count     ?? 0,
        pendingQuotes:      (qNew.count ?? 0) + (qContacted.count ?? 0),
        activeCampaigns:    qContacted.count ?? 0,
        completedCampaigns: qConfirmed.count ?? 0,
        totalContacts:      cTotal.count     ?? 0,
        newToday:           (qToday.count ?? 0) + (cToday.count ?? 0),
        // backwards compat
        newQuotes:          qNew.count       ?? 0,
        confirmedQuotes:    qConfirmed.count ?? 0,
        newContacts:        cNew.count       ?? 0,
        repliedContacts:    0,
      });
      setQuotes((qRecent.data   ?? []) as QuoteRequest[]);
      setContacts((cRecent.data ?? []) as ContactMessage[]);
      setChartQ(qAll.data   ?? []);
      setChartC(cAll.data   ?? []);
      setLoading(false);
    })();
  }, []);

  const monthly   = buildMonthly(chartQ, chartC);
  const statusDist = buildStatusDist(chartQ);

  const statCards = stats ? [
    { title: "Total Quotes",    value: stats.totalQuotes,        icon: FileText,     color: "#0057D9", sub: "All time"          },
    { title: "Pending",         value: stats.pendingQuotes,      icon: Clock,        color: "#D97706", sub: "New + Contacted"   },
    { title: "Active",          value: stats.activeCampaigns,    icon: Activity,     color: "#059669", sub: "Currently running" },
    { title: "Completed",       value: stats.completedCampaigns, icon: CheckCircle2, color: "#0EA5E9", sub: "Confirmed"         },
    { title: "Messages",        value: stats.totalContacts,      icon: MessageSquare,color: "#7C3AED", sub: "All time"          },
    { title: "New Today",       value: stats.newToday,           icon: Zap,          color: "#F59E0B", sub: "Quotes + messages" },
  ] : [];

  const confirmedQuotes = quotes.filter(q => q.status === "confirmed");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <Fade delay={0}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading font-bold text-2xl text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-ET", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-2 bg-[#0057D9] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#003DA0] transition-colors shadow-md"
          >
            <TrendingUp size={15} /> View All Requests
          </Link>
        </div>
      </Fade>

      {/* ── Stat Cards ── */}
      <Fade delay={0.05}>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonStatCard key={i} />)
            : statCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05 }}
                >
                  <StatCard
                    title={card.title}
                    value={card.value}
                    subtitle={card.sub}
                    icon={card.icon}
                    color={card.color}
                  />
                </motion.div>
              ))
          }
        </div>
      </Fade>

      {/* ── Charts ── */}
      <Fade delay={0.15}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Monthly area chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading font-bold text-gray-900 text-sm">Monthly Activity</h3>
                <p className="text-gray-400 text-xs mt-0.5">Quote requests &amp; messages — last 6 months</p>
              </div>
              <Calendar size={16} className="text-gray-300" />
            </div>
            <MonthlyChart data={monthly} />
          </div>

          {/* Status donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-heading font-bold text-gray-900 text-sm">Quote Status</h3>
                <p className="text-gray-400 text-xs mt-0.5">Distribution by status</p>
              </div>
              <Activity size={16} className="text-gray-300" />
            </div>
            <StatusDonut data={statusDist} title="Quotes" />
          </div>
        </div>
      </Fade>

      {/* ── Recent Quote Requests + Messages ── */}
      <Fade delay={0.2}>
        <div className="grid lg:grid-cols-2 gap-6">

          <TableCard
            title="Recent Quote Requests"
            href="/admin/quotes"
            loading={loading}
            empty={quotes.length === 0}
          >
            <div className="divide-y divide-gray-50">
              {quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/admin/quotes/${q.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#0057D9] transition-colors">
                      {q.full_name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{PACKAGE_LABELS[q.package]}</span>
                      <span>·</span>
                      <span className="font-mono">{q.reference_number}</span>
                      <span>·</span>
                      <span>{fmt(q.created_at)}</span>
                    </div>
                  </div>
                  <StatusBadge status={q.status} type="quote" />
                </Link>
              ))}
            </div>
          </TableCard>

          <TableCard
            title="Recent Contact Messages"
            href="/admin/contacts"
            loading={loading}
            empty={contacts.length === 0}
          >
            <div className="divide-y divide-gray-50">
              {contacts.map((m) => (
                <Link
                  key={m.id}
                  href={`/admin/contacts/${m.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors group"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="font-semibold text-gray-900 text-sm truncate group-hover:text-[#0057D9] transition-colors">
                      {m.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <span className="truncate max-w-[180px]">{m.subject}</span>
                      <span>·</span>
                      <span>{fmt(m.created_at)}</span>
                    </div>
                  </div>
                  <StatusBadge status={m.status} type="contact" />
                </Link>
              ))}
            </div>
          </TableCard>
        </div>
      </Fade>

      {/* ── Recent Campaigns ── */}
      <Fade delay={0.25}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h3 className="font-heading font-bold text-gray-900 text-sm">Recent Campaigns</h3>
              <p className="text-gray-400 text-xs mt-0.5">Confirmed advertising campaigns</p>
            </div>
            <Link href="/admin/quotes" className="text-xs text-[#0057D9] font-semibold hover:underline flex items-center gap-1 mt-0.5">
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
          ) : confirmedQuotes.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-gray-500 text-sm font-medium">No confirmed campaigns yet</div>
              <div className="text-gray-400 text-xs mt-1">
                Campaigns appear here once a quote request is confirmed
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["Advertiser", "Package", "Category", "Start Date", "Reference"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {confirmedQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/quotes/${q.id}`} className="font-semibold text-gray-900 text-sm hover:text-[#0057D9] transition-colors">
                          {q.full_name}
                        </Link>
                        <div className="text-xs text-gray-400">{q.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                        {PACKAGE_LABELS[q.package]}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                        {q.business_category}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                        {q.preferred_start_date ? fmt(q.preferred_start_date) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <code className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-mono">
                          {q.reference_number}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Fade>
    </div>
  );
}
