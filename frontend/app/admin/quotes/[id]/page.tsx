"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, User, Clock,
  Save, CheckCircle, AlertCircle, FileVideo,
  Download, CalendarDays, Target, MessageSquare,
  Image as ImageIcon, Megaphone, X,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import InternalNotes from "@/components/admin/InternalNotes";
import { getAdminClient } from "@/lib/supabase-admin";
import type { QuoteRequest, QuoteStatus, QuoteTimeline } from "@/types/admin";
import { QUOTE_STATUS_CONFIG, PACKAGE_LABELS, PACKAGE_PRICES } from "@/types/admin";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-ET", { dateStyle: "medium", timeStyle: "short" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", { month: "long", day: "numeric", year: "numeric" });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium w-36 flex-shrink-0 mt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
    </div>
  );
}

function Section({ title, icon: Icon, color, children }: {
  title: string; icon: React.ElementType; color: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon size={14} style={{ color }} />
        </div>
        <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/** Modal that appears when admin clicks "Approve & Create Campaign" */
function CreateCampaignDialog({
  quote,
  onConfirm,
  onSkip,
  onCancel,
  creating,
}: {
  quote: QuoteRequest;
  onConfirm: () => void;
  onSkip: () => void;
  onCancel: () => void;
  creating: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 bg-[#059669]/10 rounded-2xl flex items-center justify-center mb-4">
          <Megaphone size={22} className="text-[#059669]" />
        </div>

        <h2 className="font-heading font-bold text-gray-900 text-lg mb-1">
          Create a Campaign?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          This quote request is being approved. Would you like to automatically
          create a campaign linked to{" "}
          <span className="font-semibold text-gray-800">{quote.full_name}</span>?
        </p>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Reference</span>
            <code className="font-mono font-bold text-[#0057D9]">{quote.reference_number}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Package</span>
            <span className="font-semibold text-gray-700">{PACKAGE_LABELS[quote.package]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Category</span>
            <span className="font-semibold text-gray-700">{quote.business_category}</span>
          </div>
          {quote.ad_file_name && (
            <div className="flex justify-between">
              <span className="text-gray-400">Ad File</span>
              <span className="font-semibold text-gray-700 truncate max-w-[160px]">{quote.ad_file_name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSkip}
            disabled={creating}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Approve Only
          </button>
          <button
            onClick={onConfirm}
            disabled={creating}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] text-white text-sm font-bold hover:bg-[#047857] transition-colors shadow-md disabled:opacity-60"
          >
            {creating ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Creating…</>
            ) : (
              <><Megaphone size={15} /> Yes, Create Campaign</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [quote,     setQuote]     = useState<QuoteRequest | null>(null);
  const [timeline,  setTimeline]  = useState<QuoteTimeline[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [status,    setStatus]    = useState<QuoteStatus>("pending");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  // Campaign creation dialog state
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [pendingStatus,      setPendingStatus]      = useState<QuoteStatus | null>(null);
  const [creatingCampaign,   setCreatingCampaign]   = useState(false);
  const [campaignCreated,    setCampaignCreated]     = useState<string | null>(null); // campaign id

  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const [{ data }, { data: tl }] = await Promise.all([
        db.from("quote_requests").select("*").eq("id", id).single(),
        db.from("quote_timeline").select("*").eq("quote_id", id).order("created_at", { ascending: false }),
      ]);
      if (!data) { router.replace("/admin/quotes"); return; }
      setQuote(data as QuoteRequest);
      setStatus((data.status as QuoteStatus) ?? "pending");
      setTimeline((tl ?? []) as QuoteTimeline[]);

      // Pre-populate campaign link if one already exists for this quote
      const { data: existingCampaign } = await db
        .from("campaigns")
        .select("id")
        .eq("quote_request_id", data.id)
        .maybeSingle();
      if (existingCampaign) setCampaignCreated(existingCampaign.id);

      setLoading(false);
    }
    load();
  }, [id, router]);

  /** Persist status + notes, optionally update timeline */
  async function persistSave(newStatus: QuoteStatus, addTimeline: boolean) {
    const db = getAdminClient();
    const { error: err } = await db
      .from("quote_requests")
      .update({ status: newStatus })
      .eq("id", id);
    if (err) throw err;

    if (addTimeline) {
      await db.from("quote_timeline").insert({
        quote_id: id, status: newStatus,
        note: `Status changed to "${QUOTE_STATUS_CONFIG[newStatus].label}"`,
        created_by: "Admin",
      });
      const { data: tl } = await db
        .from("quote_timeline").select("*").eq("quote_id", id)
        .order("created_at", { ascending: false });
      setTimeline((tl ?? []) as QuoteTimeline[]);
    }
    setQuote((prev) => prev ? { ...prev, status: newStatus } : prev);
  }

  /** Build a campaign number: CAM-YYYY-NNNN */
  async function generateCampaignNumber(): Promise<string> {
    const db = getAdminClient();
    const year = new Date().getFullYear();
    const { count } = await db
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .like("campaign_number", `CAM-${year}-%`);
    const seq = ((count ?? 0) + 1).toString().padStart(4, "0");
    return `CAM-${year}-${seq}`;
  }

  /** Called when admin clicks Save — intercepts "approved" to show dialog */
  const handleSave = async () => {
    if (!quote) return;
    const statusChanged = status !== quote.status;

    // If moving AWAY from approved, delete the linked campaign
    if (quote.status === "approved" && status !== "approved" && statusChanged && campaignCreated) {
      setSaving(true); setError("");
      try {
        const db = getAdminClient();
        await db.from("campaigns").delete().eq("id", campaignCreated);
        setCampaignCreated(null);
        await persistSave(status, true);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (status === "approved" && statusChanged) {
      // If a campaign already exists for this quote, don't prompt again
      if (campaignCreated) {
        setSaving(true); setError("");
        try {
          await persistSave(status, true);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : "Save failed");
        } finally {
          setSaving(false);
        }
        return;
      }
      // No campaign yet — show the creation dialog
      setPendingStatus(status);
      setShowCampaignDialog(true);
      return;
    }

    setSaving(true); setError("");
    try {
      await persistSave(status, statusChanged);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /** Approve without creating a campaign */
  const handleApproveOnly = async () => {
    if (!pendingStatus || !quote) return;
    setSaving(true); setError(""); setShowCampaignDialog(false);
    try {
      await persistSave(pendingStatus, true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false); setPendingStatus(null);
    }
  };

  /** Approve AND create campaign */
  const handleApproveAndCreate = async () => {
    if (!pendingStatus || !quote) return;
    setCreatingCampaign(true); setError("");
    try {
      await persistSave(pendingStatus, true);

      const db = getAdminClient();

      // Guard: check if a campaign already exists for this quote
      const { data: existing } = await db
        .from("campaigns")
        .select("id")
        .eq("quote_request_id", quote.id)
        .maybeSingle();

      if (existing) {
        // Already has a campaign — just link to it, don't create a duplicate
        setCampaignCreated(existing.id);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        return;
      }

      const campaignNumber = await generateCampaignNumber();
      const { data: camp, error: campErr } = await db.from("campaigns").insert({
        campaign_number:    campaignNumber,
        reference_number:   quote.reference_number,
        quote_request_id:   quote.id,
        customer_name:      quote.full_name,
        company:            quote.company_name ?? null,
        package:            quote.package,
        business_category:  quote.business_category,
        campaign_objective: quote.campaign_objective,
        ad_file_url:        quote.ad_file_url ?? null,
        ad_file_name:       quote.ad_file_name ?? null,
        start_date:         quote.preferred_start_date ?? null,
        campaign_status:    "ready_for_scheduling",
        payment_status:     "pending",
      }).select("id").single();

      if (campErr) throw campErr;
      setCampaignCreated(camp.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create campaign");
    } finally {
      setCreatingCampaign(false); setShowCampaignDialog(false); setPendingStatus(null);
    }
  };

  const handleDownload = async () => {
    if (!quote?.ad_file_url) return;
    try {
      const parts = new URL(quote.ad_file_url).pathname.split("/advertisements/");
      const filePath = parts[1];
      if (!filePath) { window.open(quote.ad_file_url, "_blank"); return; }
      const supabase = getAdminClient();
      const { data, error: sigErr } = await supabase.storage
        .from("advertisements")
        .createSignedUrl(filePath, 600, { download: quote.ad_file_name ?? true });
      if (sigErr || !data?.signedUrl) { window.open(quote.ad_file_url, "_blank"); return; }
      const a = document.createElement("a");
      a.href = data.signedUrl; a.download = quote.ad_file_name ?? "advertisement";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch { window.open(quote.ad_file_url, "_blank"); }
  };

  const handlePreview = async () => {
    if (!quote?.ad_file_url) return;
    setPreviewing(true);
    try {
      const parts = new URL(quote.ad_file_url).pathname.split("/advertisements/");
      const filePath = parts[1];
      if (!filePath) { setPreviewUrl(quote.ad_file_url); setPreviewing(false); return; }
      const supabase = getAdminClient();
      const { data } = await supabase.storage.from("advertisements").createSignedUrl(filePath, 600);
      setPreviewUrl(data?.signedUrl ?? quote.ad_file_url);
    } catch { setPreviewUrl(quote.ad_file_url); }
    setPreviewing(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!quote)  return null;

  const contactLabel = quote.preferred_contact_method === "whatsapp" ? "WhatsApp"
    : quote.preferred_contact_method.charAt(0).toUpperCase() + quote.preferred_contact_method.slice(1);
  const isImage = quote.ad_file_name?.match(/\.(jpg|jpeg|png)$/i);
  const isVideo = quote.ad_file_name?.match(/\.mp4$/i);

  return (
    <>
      {/* Campaign creation dialog */}
      <AnimatePresence>
        {showCampaignDialog && quote && (
          <CreateCampaignDialog
            quote={quote}
            onConfirm={handleApproveAndCreate}
            onSkip={handleApproveOnly}
            onCancel={() => { setShowCampaignDialog(false); setPendingStatus(null); }}
            creating={creatingCampaign}
          />
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-5">
        {/* Back */}
        <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0057D9] transition-colors font-medium">
          <ArrowLeft size={15} /> Back to Quotes
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h1 className="font-heading font-bold text-xl text-gray-900">{quote.full_name}</h1>
                <StatusBadge status={quote.status} type="quote" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <code className="text-xs bg-[#0057D9]/8 text-[#0057D9] font-mono font-bold px-3 py-1 rounded-lg">
                  {quote.reference_number}
                </code>
                <span className="text-sm text-gray-500">{PACKAGE_LABELS[quote.package]} · {PACKAGE_PRICES[quote.package]}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Campaign created banner */}
              {campaignCreated && (
                <Link
                  href={`/admin/campaigns/${campaignCreated}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] bg-[#059669]/10 px-3 py-1.5 rounded-full hover:bg-[#059669]/20 transition-colors"
                >
                  <Megaphone size={12} /> View Campaign
                </Link>
              )}
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock size={13} /> {fmt(quote.created_at)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Customer info */}
            <Section title="Customer Information" icon={User} color="#0057D9">
              <Row label="Full Name" value={quote.full_name} />
              <Row label="Company"   value={quote.company_name ?? "—"} />
              <Row label="Email"     value={<a href={`mailto:${quote.email}`} className="text-[#0057D9] hover:underline">{quote.email}</a>} />
              <Row label="Phone"     value={<a href={`tel:${quote.phone}`} className="text-[#0057D9] hover:underline">{quote.phone}</a>} />
              <Row label="Preferred" value={contactLabel} />
            </Section>

            {/* Campaign info */}
            <Section title="Campaign Information" icon={Target} color="#7C3AED">
              <Row label="Package"    value={`${PACKAGE_LABELS[quote.package]} (${PACKAGE_PRICES[quote.package]} excl. VAT)`} />
              <Row label="Category"   value={quote.business_category} />
              <Row label="Objective"  value={quote.campaign_objective} />
              <Row label="Start Date" value={quote.preferred_start_date ? fmtDate(quote.preferred_start_date) : "Not specified"} />
              {quote.special_instructions && (
                <Row label="Instructions" value={<span className="whitespace-pre-wrap">{quote.special_instructions}</span>} />
              )}
            </Section>

            {/* Advertisement */}
            <Section title="Uploaded Advertisement" icon={FileVideo} color="#059669">
              {quote.send_later ? (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <CalendarDays size={16} className="text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-700 font-medium">Customer will send advertisement later.</p>
                </div>
              ) : quote.ad_file_url ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0057D9]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileVideo size={18} className="text-[#0057D9]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{quote.ad_file_name ?? "Advertisement File"}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Uploaded file</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handlePreview} disabled={previewing}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors px-3 py-2 rounded-lg hover:bg-[#7C3AED]/8">
                        <ImageIcon size={15} /> {previewing ? "Loading…" : "Preview"}
                      </button>
                      <button onClick={handleDownload}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#0057D9] hover:text-[#003DA0] transition-colors px-3 py-2 rounded-lg hover:bg-[#0057D9]/8">
                        <Download size={15} /> Download
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {previewUrl && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-900">
                        {isImage ? (
                          <img src={previewUrl} alt="Ad preview" className="w-full max-h-80 object-contain bg-gray-100" />
                        ) : isVideo ? (
                          <video controls className="w-full max-h-80 bg-black" src={previewUrl} />
                        ) : (
                          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Preview not available for this file type</div>
                        )}
                        <div className="flex justify-end p-2">
                          <button onClick={() => setPreviewUrl(null)} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1">Close preview</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No file uploaded.</p>
              )}
            </Section>

            {/* Internal notes */}
            <Section title="Internal Notes" icon={MessageSquare} color="#D97706">
              <InternalNotes parentId={id} parentType="quote_request" accentColor="#D97706" />
            </Section>

            {/* Change Status */}
            <Section title="Change Status" icon={Clock} color="#DC2626">
              <div className="flex flex-wrap gap-2 mb-5">
                {(Object.keys(QUOTE_STATUS_CONFIG) as QuoteStatus[]).map((s) => {
                  const cfg = QUOTE_STATUS_CONFIG[s];
                  const active = status === s;
                  return (
                    <button key={s} onClick={() => setStatus(s)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150"
                      style={active
                        ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                        : { borderColor: "#E5E7EB", backgroundColor: "white", color: "#6B7280" }}>
                      {cfg.icon} {cfg.label}
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={handleSave} disabled={saving || creatingCampaign}
                  className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md">
                  {saving ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Saving…</>
                  ) : saved ? (
                    <><CheckCircle size={16} /> Saved!</>
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </button>
                {status === "approved" && quote.status !== "approved" && (
                  <p className="text-xs text-[#059669] font-medium flex items-center gap-1.5">
                    <Megaphone size={12} /> Saving will prompt campaign creation
                  </p>
                )}
                {status !== "approved" && quote.status === "approved" && campaignCreated && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                    <AlertCircle size={12} /> Saving will delete the linked campaign
                  </p>
                )}
              </div>
            </Section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Campaign link card (if campaign exists) */}
            {campaignCreated && (
              <div className="bg-[#059669]/5 border border-[#059669]/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone size={14} className="text-[#059669]" />
                  <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider">Campaign Created</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">A campaign has been created and linked to this quote request.</p>
                <Link href={`/admin/campaigns/${campaignCreated}`}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[#059669] text-white text-xs font-semibold hover:bg-[#047857] transition-colors">
                  <Megaphone size={13} /> View Campaign
                </Link>
              </div>
            )}

            {/* Quick contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Quick Contact</h3>
              <div className="space-y-2">
                <a href={`mailto:${quote.email}?subject=Re: Your Quote Request ${quote.reference_number}`}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[#0057D9] text-white text-xs font-semibold hover:bg-[#003DA0] transition-colors">
                  <Mail size={13} /> Email Customer
                </a>
                <a href={`https://wa.me/${quote.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1DA851] transition-colors">
                  <Phone size={13} /> WhatsApp
                </a>
                <a href={`tel:${quote.phone}`}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors">
                  <Phone size={13} /> Call {quote.phone}
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider mb-4">Timeline</h3>
              {timeline.length === 0 ? (
                <div className="text-xs text-gray-400 text-center py-4">No status changes yet</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#0057D9] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[9px]">✓</span>
                      </div>
                      {timeline.length > 0 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="text-xs font-semibold text-gray-800">Quote submitted</div>
                      <div className="text-xs text-gray-400 mt-0.5">{fmt(quote.created_at)}</div>
                    </div>
                  </div>
                  {[...timeline].reverse().map((entry, i) => {
                    const cfg = QUOTE_STATUS_CONFIG[entry.status as QuoteStatus];
                    return (
                      <div key={entry.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]"
                            style={{ backgroundColor: cfg?.bg ?? "#F3F4F6", color: cfg?.color ?? "#6B7280" }}>
                            {cfg?.icon ?? "•"}
                          </div>
                          {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="text-xs font-semibold text-gray-800">{entry.note ?? cfg?.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{fmt(entry.created_at)}</div>
                          {entry.created_by && <div className="text-xs text-gray-300 mt-0.5">by {entry.created_by}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
