"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Mail, Phone, User, Clock,
  Save, CheckCircle, AlertCircle, MessageSquare,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getAdminClient } from "@/lib/supabase-admin";
import type { ContactMessage, ContactStatus } from "@/types/admin";
import { CONTACT_STATUS_CONFIG } from "@/types/admin";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-ET", {
    dateStyle: "full", timeStyle: "short",
  });
}

export default function ContactDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();

  const [msg,     setMsg]     = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes,   setNotes]   = useState("");
  const [status,  setStatus]  = useState<ContactStatus>("new");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const { data } = await db.from("contacts").select("*").eq("id", id).single();
      if (!data) { router.replace("/admin/contacts"); return; }
      setMsg(data as ContactMessage);
      setNotes(data.admin_notes ?? "");
      setStatus(data.status as ContactStatus);
      setLoading(false);
    }
    load();
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const db = getAdminClient();
    const { error: err } = await db
      .from("contacts")
      .update({ status, admin_notes: notes || null })
      .eq("id", id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setMsg((prev) => prev ? { ...prev, status, admin_notes: notes } : prev);
  };

  if (loading) return <LoadingSpinner />;
  if (!msg)    return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/admin/contacts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0057D9] transition-colors font-medium">
        <ArrowLeft size={15} /> Back to Messages
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading font-bold text-xl text-gray-900">{msg.name}</h1>
              <StatusBadge status={msg.status} type="contact" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{msg.subject}</p>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-shrink-0">
            <Clock size={13} />
            {formatDate(msg.created_at)}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main: message + admin actions ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message body */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-[#0057D9]" /> Message
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          </div>

          {/* Admin notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-bold text-gray-800 text-base mb-4">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add private notes visible only to admins…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 resize-none transition-all"
            />
          </div>

          {/* Status update + save */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-bold text-gray-800 text-base mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {(Object.keys(CONTACT_STATUS_CONFIG) as ContactStatus[]).map((s) => {
                const cfg = CONTACT_STATUS_CONFIG[s];
                const active = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150"
                    style={active
                      ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                      : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#6B7280" }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              {saving ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Saving…</>
              ) : saved ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </div>

        {/* ── Sidebar: contact info ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-heading font-bold text-gray-800 text-sm mb-4 uppercase tracking-wider">Contact Info</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User size={15} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{msg.name}</span>
              </div>
              <a href={`mailto:${msg.email}`} className="flex items-center gap-3 text-sm text-[#0057D9] hover:underline">
                <Mail size={15} className="flex-shrink-0" />
                {msg.email}
              </a>
              {msg.phone && (
                <a href={`tel:${msg.phone}`} className="flex items-center gap-3 text-sm text-[#0057D9] hover:underline">
                  <Phone size={15} className="flex-shrink-0" />
                  {msg.phone}
                </a>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-heading font-bold text-gray-800 text-sm mb-3 uppercase tracking-wider">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors"
              >
                <Mail size={14} /> Reply by Email
              </a>
              {msg.phone && (
                <a
                  href={`https://wa.me/${msg.phone.replace(/\D/g, "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1DA851] transition-colors"
                >
                  <Phone size={14} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
