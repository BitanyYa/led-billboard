"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mail, Phone, User, Clock,
  CheckCircle, AlertCircle, MessageSquare,
  Eye, MailCheck, Archive, Trash2, Building2,
  Globe, Shield, RotateCcw,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getAdminClient } from "@/lib/supabase-admin";
import type { ContactMessage, ContactStatus } from "@/types/admin";
import { CONTACT_STATUS_CONFIG } from "@/types/admin";

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ET", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

/* ── Section wrapper ─────────────────────────────────────────────── */
function Section({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon size={14} style={{ color }} />
        </div>
        <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ── Info row ────────────────────────────────────────────────────── */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium w-28 flex-shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
    </div>
  );
}

/* ── Quick-action button ─────────────────────────────────────────── */
function ActionButton({
  icon: Icon,
  label,
  sublabel,
  color,
  bg,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  color: string;
  bg: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-sm"
      style={{ borderColor: color + "30", backgroundColor: bg }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "20" }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div>
        <div className="text-xs font-bold" style={{ color }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
        )}
      </div>
    </button>
  );
}

/* ── Delete button with confirm arm ─────────────────────────────── */
function DeleteButton({
  onConfirm,
  disabled,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  function handleClick() {
    if (armed) {
      onConfirm();
    } else {
      setArmed(true);
      setTimeout(() => setArmed(false), 3500);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
        armed
          ? "border-red-300 bg-red-50"
          : "border-red-100 bg-red-50/40 hover:bg-red-50 hover:border-red-200"
      }`}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-100">
        <Trash2 size={15} className="text-red-600" />
      </div>
      <div>
        <div className="text-xs font-bold text-red-600">
          {armed ? "Click again to confirm" : "Delete Message"}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {armed ? "This cannot be undone" : "Permanently remove"}
        </div>
      </div>
    </button>
  );
}

/* ── Toast notification ──────────────────────────────────────────── */
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
        type === "success"
          ? "bg-[#059669] text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function ContactDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [msg,     setMsg]     = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState(false);
  const [toast,   setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Load contact; auto-mark as read if new ── */
  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const { data } = await db
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) { router.replace("/admin/contacts"); return; }

      const contact = data as ContactMessage;
      setMsg(contact);

      // Auto-mark as read on open
      if (contact.status === "new") {
        await db.from("contacts").update({ status: "read" }).eq("id", id);
        setMsg({ ...contact, status: "read" });
      }

      setLoading(false);
    }
    load();
  }, [id, router]);

  /* ── Status update ── */
  async function handleStatus(next: ContactStatus) {
    if (!msg || acting) return;
    setActing(true);
    const db = getAdminClient();
    const { error } = await db
      .from("contacts")
      .update({ status: next })
      .eq("id", id);
    setActing(false);
    if (error) { showToast(error.message, "error"); return; }
    setMsg((prev) => prev ? { ...prev, status: next } : prev);
    showToast(`Marked as ${CONTACT_STATUS_CONFIG[next].label}`);
  }

  /* ── Delete ── */
  async function handleDelete() {
    if (!msg || acting) return;
    setActing(true);
    const db = getAdminClient();
    const { error } = await db.from("contacts").delete().eq("id", id);
    if (error) { setActing(false); showToast(error.message, "error"); return; }
    router.replace("/admin/contacts");
  }

  if (loading) return <LoadingSpinner />;
  if (!msg)    return null;

  const status = msg.status as ContactStatus;
  const cfg    = CONTACT_STATUS_CONFIG[status];

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Back ── */}
        <Link
          href="/admin/contacts"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0057D9] transition-colors font-medium"
        >
          <ArrowLeft size={15} /> Back to Messages
        </Link>

        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h1 className="font-heading font-bold text-xl text-gray-900">{msg.name}</h1>
                <StatusBadge status={status} type="contact" />
              </div>
              <p className="text-gray-500 text-sm font-medium">{msg.subject}</p>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-shrink-0">
              <Clock size={13} />
              {formatDate(msg.created_at)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Full message */}
            <Section title="Message" icon={MessageSquare} color="#0057D9">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </Section>

            {/* Customer information */}
            <Section title="Customer Information" icon={User} color="#7C3AED">
              <Row label="Full Name" value={msg.name} />
              {msg.company && <Row label="Company" value={msg.company} />}
              <Row
                label="Email"
                value={
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-[#0057D9] hover:underline"
                  >
                    {msg.email}
                  </a>
                }
              />
              <Row
                label="Phone"
                value={
                  msg.phone ? (
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-[#0057D9] hover:underline"
                    >
                      {msg.phone}
                    </a>
                  ) : (
                    <span className="text-gray-300">Not provided</span>
                  )
                }
              />
              <Row label="Received" value={formatDateShort(msg.created_at)} />
              <Row label="Status" value={<StatusBadge status={status} type="contact" />} />
            </Section>

            {/* Technical metadata (collapsible feel via subtle styling) */}
            {(msg.ip_address || msg.user_agent) && (
              <Section title="Submission Metadata" icon={Shield} color="#6B7280">
                {msg.ip_address && <Row label="IP Address" value={<code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{msg.ip_address}</code>} />}
                {msg.user_agent && (
                  <Row
                    label="User Agent"
                    value={
                      <span className="text-xs text-gray-500 break-all font-mono leading-relaxed">
                        {msg.user_agent}
                      </span>
                    }
                  />
                )}
              </Section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2.5">

                {/* Reply by email */}
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#0057D9] text-white text-xs font-bold hover:bg-[#003DA0] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
                    <Mail size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Reply by Email</div>
                    <div className="text-[10px] text-blue-200 mt-0.5 truncate max-w-[130px]">{msg.email}</div>
                  </div>
                </a>

                {/* WhatsApp */}
                {msg.phone && (
                  <a
                    href={`https://wa.me/${msg.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1DA851] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/20">
                      <Phone size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">WhatsApp</div>
                      <div className="text-[10px] text-green-100 mt-0.5">{msg.phone}</div>
                    </div>
                  </a>
                )}

                <div className="border-t border-gray-50 pt-2.5 space-y-2">

                  {/* Mark as Read */}
                  <ActionButton
                    icon={Eye}
                    label="Mark as Read"
                    sublabel={status === "read" ? "Already marked" : "Opens the message"}
                    color="#7C3AED"
                    bg="#F5F3FF"
                    onClick={() => handleStatus("read")}
                    disabled={acting || status === "read"}
                  />

                  {/* Mark as Replied */}
                  <ActionButton
                    icon={MailCheck}
                    label="Mark as Replied"
                    sublabel={status === "replied" ? "Already marked" : "Record reply sent"}
                    color="#059669"
                    bg="#ECFDF5"
                    onClick={() => handleStatus("replied")}
                    disabled={acting || status === "replied"}
                  />

                  {/* Archive / Restore */}
                  {status !== "archived" ? (
                    <ActionButton
                      icon={Archive}
                      label="Archive"
                      sublabel="Move out of active inbox"
                      color="#6B7280"
                      bg="#F9FAFB"
                      onClick={() => handleStatus("archived")}
                      disabled={acting}
                    />
                  ) : (
                    <ActionButton
                      icon={RotateCcw}
                      label="Restore to New"
                      sublabel="Move back to inbox"
                      color="#0057D9"
                      bg="#EFF6FF"
                      onClick={() => handleStatus("new")}
                      disabled={acting}
                    />
                  )}

                  {/* Delete */}
                  <DeleteButton onConfirm={handleDelete} disabled={acting} />
                </div>
              </div>
            </div>

            {/* Status history / current state card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider mb-4">
                Current Status
              </h3>
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: cfg.bg }}
              >
                <span className="text-xl">{cfg.icon}</span>
                <div>
                  <div className="text-xs font-bold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {{
                      new:      "Not yet opened by admin",
                      read:     "Opened by admin",
                      replied:  "Admin has responded",
                      archived: "Moved to archive",
                    }[status]}
                  </div>
                </div>
              </div>

              {/* Status change buttons */}
              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                  Change to
                </p>
                {(Object.keys(CONTACT_STATUS_CONFIG) as ContactStatus[])
                  .filter((s) => s !== status)
                  .map((s) => {
                    const c = CONTACT_STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatus(s)}
                        disabled={acting}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:shadow-sm disabled:opacity-40"
                        style={{ borderColor: c.color + "30", backgroundColor: c.bg, color: c.color }}
                      >
                        <span>{c.icon}</span> {c.label}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Contact links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">
                Contact Links
              </h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${msg.email}`}
                  className="flex items-center gap-2 text-xs text-[#0057D9] hover:underline"
                >
                  <Mail size={12} className="flex-shrink-0" />
                  {msg.email}
                </a>
                {msg.phone && (
                  <a
                    href={`tel:${msg.phone}`}
                    className="flex items-center gap-2 text-xs text-[#0057D9] hover:underline"
                  >
                    <Phone size={12} className="flex-shrink-0" />
                    {msg.phone}
                  </a>
                )}
                {msg.company && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Building2 size={12} className="flex-shrink-0 text-gray-400" />
                    {msg.company}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
