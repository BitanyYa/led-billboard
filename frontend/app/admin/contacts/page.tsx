"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search, MessageSquare, MoreHorizontal,
  ArrowRight, Eye, MailCheck, Archive,
  Trash2, RotateCcw,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import EmptyState from "@/components/admin/EmptyState";
import { getAdminClient } from "@/lib/supabase-admin";
import type { ContactMessage, ContactStatus } from "@/types/admin";
import { CONTACT_STATUS_CONFIG } from "@/types/admin";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "",         label: "All Statuses" },
  { value: "new",      label: "New"          },
  { value: "read",     label: "Read"         },
  { value: "replied",  label: "Replied"      },
  { value: "archived", label: "Archived"     },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/* ── Dropdown menu ─────────────────────────────────────────────────── */
interface DropdownItem {
  label: string;
  icon: React.ElementType;
  color?: string;
  danger?: boolean;
  divider?: boolean;
  onClick: () => void;
}

const MENU_W = 200;

function RowMenu({ items }: { items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ top: 0, left: 0 });
  const btnRef          = useRef<HTMLButtonElement>(null);
  const menuRef         = useRef<HTMLDivElement>(null);

  function openMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!btnRef.current) return;
    const rect   = btnRef.current.getBoundingClientRect();
    const vw     = window.innerWidth;
    const vh     = window.innerHeight;
    // Each item ~36px + 16px padding + divider
    const estH   = items.length * 36 + 16 + (items.filter(i => i.divider).length * 9);
    const left   = Math.max(8, Math.min(rect.right - MENU_W, vw - MENU_W - 8));
    // Open upward if not enough space below
    const top    = rect.bottom + 6 + estH > vh
      ? Math.max(8, rect.top - estH - 6)
      : rect.bottom + 6;
    setPos({ top, left });
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;

    // Store stable references so removeEventListener works correctly
    function onMouseDown(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }

    function onScroll() {
      if (!btnRef.current) { setOpen(false); return; }
      const rect = btnRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setOpen(false);
        return;
      }
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      const estH = items.length * 36 + 16 + (items.filter(i => i.divider).length * 9);
      const left = Math.max(8, Math.min(rect.right - MENU_W, vw - MENU_W - 8));
      const top  = rect.bottom + 6 + estH > vh
        ? Math.max(8, rect.top - estH - 6)
        : rect.bottom + 6;
      setPos({ top, left });
    }

    document.addEventListener("mousedown", onMouseDown);
    // Attach to all scrollable ancestors — capture phase catches everything
    document.addEventListener("scroll", onScroll, true);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open, items]);

  const menu = (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top:  pos.top,
          left: pos.left,
          width: MENU_W,
          pointerEvents: "auto",
        }}
        className="bg-white border border-gray-100 rounded-xl shadow-2xl py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
      {items.map((item, i) => (
        <div key={i}>
          {item.divider && <div className="my-1 border-t border-gray-100" />}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              item.onClick();
            }}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold transition-colors text-left whitespace-nowrap ${
              item.danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-50"
            }`}
            style={item.color && !item.danger ? { color: item.color } : undefined}
          >
            <item.icon size={13} className="flex-shrink-0" />
            {item.label}
          </button>
        </div>
      ))}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={btnRef}
        onClick={openMenu}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        title="Actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && typeof window !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════ */
export default function ContactsPage() {
  const [rows,    setRows]    = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("");

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();
    const { data } = await db
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as ContactMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) => {
    if (status && r.status !== status) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone ?? "").toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  async function updateStatus(id: string, next: ContactStatus) {
    const db = getAdminClient();
    const { error } = await db.from("contacts").update({ status: next }).eq("id", id);
    if (!error) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  }

  async function deleteContact(id: string) {
    const db = getAdminClient();
    const { error } = await db.from("contacts").delete().eq("id", id);
    if (!error) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function buildMenuItems(r: ContactMessage): DropdownItem[] {
    const items: DropdownItem[] = [
      {
        label: "View Details",
        icon: ArrowRight,
        color: "#0057D9",
        onClick: () => { window.location.href = `/admin/contacts/${r.id}`; },
      },
    ];

    if (r.status !== "read" && r.status !== "replied" && r.status !== "archived") {
      items.push({ label: "Mark as Read",    icon: Eye,     color: "#7C3AED", onClick: () => updateStatus(r.id, "read")     });
    }
    if (r.status !== "replied" && r.status !== "archived") {
      items.push({ label: "Mark as Replied", icon: MailCheck, color: "#059669", onClick: () => updateStatus(r.id, "replied") });
    }
    if (r.status !== "archived") {
      items.push({ label: "Archive",         icon: Archive,   color: "#6B7280", onClick: () => updateStatus(r.id, "archived") });
    } else {
      items.push({ label: "Restore to New",  icon: RotateCcw, color: "#0057D9", onClick: () => updateStatus(r.id, "new")      });
    }
    items.push({
      label: "Delete", icon: Trash2, danger: true, divider: true,
      onClick: () => { if (confirm("Delete this message? This cannot be undone.")) deleteContact(r.id); },
    });

    return items;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">{rows.length} total · {counts["new"] ?? 0} new</p>
      </div>

      {/* Status pill filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const active = status === opt.value;
          const cfg    = opt.value ? CONTACT_STATUS_CONFIG[opt.value as ContactStatus] : null;
          const count  = opt.value ? (counts[opt.value] ?? 0) : rows.length;
          return (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150"
              style={
                active
                  ? { borderColor: cfg?.color ?? "#0057D9", backgroundColor: cfg?.bg ?? "#EFF6FF", color: cfg?.color ?? "#0057D9" }
                  : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#6B7280" }
              }
            >
              {cfg?.icon && <span>{cfg.icon}</span>}
              {opt.label}
              <span
                className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={
                  active
                    ? { backgroundColor: cfg?.color ?? "#0057D9", color: "white" }
                    : { backgroundColor: "#F3F4F6", color: "#6B7280" }
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages found"
            description={search || status ? "Try adjusting your search or filter" : "No contact messages yet"}
          />
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-100 text-left bg-gray-50/60">
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">ID</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">Name</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-44">Email</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">Phone</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">Status</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-28">Date</th>
                <th className="px-4 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-gray-50/60 transition-colors group ${
                    r.status === "new" ? "bg-blue-50/20" : ""
                  }`}
                >
                  {/* ID */}
                  <td className="px-4 py-4">
                    <code className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                      {r.id.split('-')[0]}
                    </code>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-4">
                    <Link href={`/admin/contacts/${r.id}`} className="block">
                      <div className="flex items-center gap-2">
                        {r.status === "new" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0057D9] flex-shrink-0" />
                        )}
                        <span className={`text-sm font-semibold truncate ${r.status === "new" ? "text-gray-900" : "text-gray-700"}`}>
                          {r.name}
                        </span>
                      </div>
                      {r.company && (
                        <div className="text-xs text-gray-400 mt-0.5 pl-3.5 truncate">{r.company}</div>
                      )}
                    </Link>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-4">
                    <a
                      href={`mailto:${r.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-[#0057D9] hover:underline truncate block"
                    >
                      {r.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {r.phone ? (
                      <a
                        href={`tel:${r.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#0057D9] transition-colors truncate block"
                      >
                        {r.phone}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-4">
                    <Link href={`/admin/contacts/${r.id}`} className="block">
                      <div className="text-sm text-gray-700 font-medium truncate">{r.subject}</div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        {r.message.slice(0, 40)}{r.message.length > 40 ? "…" : ""}
                      </div>
                    </Link>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={r.status} type="contact" />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-4 text-right">
                    <RowMenu items={buildMenuItems(r)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center pb-2">
          Showing {filtered.length} of {rows.length} messages
        </p>
      )}
    </div>
  );
}
