"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Save, CheckCircle, AlertCircle, Megaphone,
  User, Building2, Target, CalendarDays, FileVideo,
  Download, MessageSquare, Clock, UserCog, CreditCard,
  Hash, Play, Pause, Volume2, VolumeX, Maximize2,
  Package, ChevronRight, RefreshCw,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getAdminClient } from "@/lib/supabase-admin";
import type { Campaign, CampaignStatus, PaymentStatus } from "@/types/admin";
import {
  CAMPAIGN_STATUS_CONFIG, PAYMENT_STATUS_CONFIG,
  PACKAGE_LABELS, PACKAGE_PRICES,
} from "@/types/admin";

/* ── helpers ─────────────────────────────────────────────────────── */
function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-ET", {
    dateStyle: "medium", timeStyle: "short",
  });
}
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-ET", {
    month: "long", day: "numeric", year: "numeric",
  });
}
function daysLeft(end: string | null): number | null {
  if (!end) return null;
  const diff = new Date(end).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ── shared layout primitives ────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 font-medium w-40 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1 min-w-0">{value}</span>
    </div>
  );
}

function Card({ title, icon: Icon, color, action, children }: {
  title: string;
  icon: React.ElementType;
  color: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-6 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + "1a" }}>
            <Icon size={14} style={{ color }} />
          </div>
          <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function InputField({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
        focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/10 transition-all bg-white" />
  );
}

/* ── Video player with custom controls ──────────────────────────── */
function VideoPlayer({ src, fileName }: { src: string; fileName: string }) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]  = useState(false);
  const [muted,   setMuted]    = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true);  }
  };
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };
  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100);
  };
  const onEnded = () => setPlaying(false);
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };
  const fullscreen = () => videoRef.current?.requestFullscreen();

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 group">
      <video
        ref={videoRef}
        src={src}
        className="w-full max-h-96 object-contain cursor-pointer"
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onClick={toggle}
      />
      {/* Controls bar */}
      <div className="bg-gray-950/95 px-4 py-3">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={seek}>
          <div className="h-full bg-[#0057D9] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={toggle}
              className="w-8 h-8 bg-[#0057D9] rounded-full flex items-center justify-center hover:bg-[#003DA0] transition-colors">
              {playing
                ? <Pause size={14} className="text-white" />
                : <Play  size={14} className="text-white ml-0.5" />}
            </button>
            <button onClick={toggleMute}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
          <span className="text-white/50 text-xs truncate max-w-[180px]">{fileName}</span>
          <button onClick={fullscreen}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline entry type ─────────────────────────────────────────── */
interface TimelineEntry {
  id: string;
  created_at: string;
  action: string;
  detail: string | null;
  actor: string | null;
}

/* ── Main page component ─────────────────────────────────────────── */
export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  /* ── data ── */
  const [campaign,  setCampaign]  = useState<Campaign | null>(null);
  const [timeline,  setTimeline]  = useState<TimelineEntry[]>([]);
  const [loading,   setLoading]   = useState(true);

  /* ── save state ── */
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  /* ── ad file ── */
  const [adUrl,      setAdUrl]      = useState<string | null>(null);
  const [adLoading,  setAdLoading]  = useState(false);

  /* ── editable fields ── */
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>("ready_for_scheduling");
  const [paymentStatus,  setPaymentStatus]  = useState<PaymentStatus>("pending");
  const [startDate,      setStartDate]      = useState("");
  const [endDate,        setEndDate]        = useState("");
  const [operator,       setOperator]       = useState("");
  const [notes,          setNotes]          = useState("");
  const [customerName,   setCustomerName]   = useState("");
  const [company,        setCompany]        = useState("");
  const [objective,      setObjective]      = useState("");

  /* ── load campaign + timeline ── */
  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const { data, error: err } = await db
        .from("campaigns").select("*").eq("id", id).single();
      if (err || !data) { router.replace("/admin/campaigns"); return; }
      const c = data as Campaign;
      setCampaign(c);
      setCampaignStatus(c.campaign_status);
      setPaymentStatus(c.payment_status);
      setStartDate(c.start_date ?? "");
      setEndDate(c.end_date ?? "");
      setOperator(c.assigned_operator ?? "");
      setNotes(c.admin_notes ?? "");
      setCustomerName(c.customer_name);
      setCompany(c.company ?? "");
      setObjective(c.campaign_objective);

      /* load timeline */
      const { data: tl } = await db
        .from("campaign_timeline")
        .select("*")
        .eq("campaign_id", id)
        .order("created_at", { ascending: false });
      setTimeline((tl ?? []) as TimelineEntry[]);

      /* auto-load signed URL for ad file */
      if (c.ad_file_url) {
        await loadSignedUrl(c.ad_file_url, c.ad_file_name);
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  /* ── resolve signed URL from Supabase Storage ── */
  async function loadSignedUrl(rawUrl: string, fileName: string | null) {
    setAdLoading(true);
    try {
      const parts = new URL(rawUrl).pathname.split("/advertisements/");
      const filePath = parts[1];
      if (!filePath) { setAdUrl(rawUrl); setAdLoading(false); return; }
      const { data } = await getAdminClient()
        .storage.from("advertisements").createSignedUrl(filePath, 3600);
      setAdUrl(data?.signedUrl ?? rawUrl);
    } catch { setAdUrl(rawUrl); }
    setAdLoading(false);
  }

  /* ── save handler with timeline entry ── */
  const handleSave = async () => {
    if (!campaign) return;
    setSaving(true); setError("");
    const db = getAdminClient();

    const updates = {
      campaign_status:    campaignStatus,
      payment_status:     paymentStatus,
      start_date:         startDate  || null,
      end_date:           endDate    || null,
      assigned_operator:  operator   || null,
      admin_notes:        notes      || null,
      customer_name:      customerName,
      company:            company    || null,
      campaign_objective: objective,
    };

    const { error: err } = await db
      .from("campaigns").update(updates).eq("id", id);

    if (err) { setError(err.message); setSaving(false); return; }

    /* write timeline entries for changed fields */
    const changes: string[] = [];
    if (campaignStatus !== campaign.campaign_status)
      changes.push(`Campaign status → ${CAMPAIGN_STATUS_CONFIG[campaignStatus].label}`);
    if (paymentStatus !== campaign.payment_status)
      changes.push(`Payment status → ${PAYMENT_STATUS_CONFIG[paymentStatus].label}`);
    if ((operator || null) !== campaign.assigned_operator)
      changes.push(`Operator → ${operator || "Unassigned"}`);
    if ((startDate || null) !== campaign.start_date)
      changes.push(`Start date → ${startDate ? fmtDate(startDate) : "Cleared"}`);
    if ((endDate || null) !== campaign.end_date)
      changes.push(`End date → ${endDate ? fmtDate(endDate) : "Cleared"}`);

    if (changes.length > 0) {
      const entry = {
        campaign_id: id,
        action:      "Updated",
        detail:      changes.join(" · "),
        actor:       "Admin",
      };
      const { data: newEntry } = await db
        .from("campaign_timeline").insert(entry).select("*").single();
      if (newEntry) {
        setTimeline((prev) => [newEntry as TimelineEntry, ...prev]);
      }
    }

    /* update local state */
    setCampaign((prev) => prev ? { ...prev, ...updates } : prev);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ── download ── */
  const handleDownload = async () => {
    if (!campaign?.ad_file_url) return;
    try {
      const parts = new URL(campaign.ad_file_url).pathname.split("/advertisements/");
      const filePath = parts[1];
      if (!filePath) { window.open(campaign.ad_file_url, "_blank"); return; }
      const { data, error: sigErr } = await getAdminClient()
        .storage.from("advertisements")
        .createSignedUrl(filePath, 600, { download: campaign.ad_file_name ?? true });
      if (sigErr || !data?.signedUrl) { window.open(campaign.ad_file_url, "_blank"); return; }
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = campaign.ad_file_name ?? "advertisement";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch { window.open(campaign.ad_file_url, "_blank"); }
  };

  const refreshAdUrl = async () => {
    if (!campaign?.ad_file_url) return;
    await loadSignedUrl(campaign.ad_file_url, campaign.ad_file_name);
  };

  if (loading) return <LoadingSpinner />;
  if (!campaign) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(campaign.ad_file_name ?? "");
  const isVideo = /\.(mp4|mov|webm)$/i.test(campaign.ad_file_name ?? "");
  const remaining = daysLeft(endDate || campaign.end_date);
  const statusCfg  = CAMPAIGN_STATUS_CONFIG[campaignStatus];
  const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* ── Back link ── */}
      <Link href="/admin/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0057D9] font-medium transition-colors">
        <ArrowLeft size={15} /> Back to Campaigns
      </Link>

      {/* ── Hero header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top colour strip matching campaign status */}
        <div className="h-1.5 w-full" style={{ backgroundColor: statusCfg.color }} />

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            {/* Left: identity */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: statusCfg.color + "1a" }}>
                <Megaphone size={22} style={{ color: statusCfg.color }} />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl text-gray-900 leading-tight">
                  {campaign.customer_name}
                </h1>
                {campaign.company && (
                  <p className="text-gray-500 text-sm mt-0.5">{campaign.company}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <StatusBadge status={campaign.campaign_status} type="campaign" />
                  <StatusBadge status={campaign.payment_status}  type="payment"  />
                  {remaining !== null && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                      ${remaining < 0
                        ? "bg-red-50 text-red-600"
                        : remaining <= 7
                        ? "bg-amber-50 text-amber-600"
                        : "bg-green-50 text-green-600"}`}>
                      <Clock size={11} />
                      {remaining < 0
                        ? `Ended ${Math.abs(remaining)}d ago`
                        : remaining === 0
                        ? "Ends today"
                        : `${remaining}d remaining`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: identifiers + created date */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex flex-wrap gap-2 justify-end">
                <code className="text-xs bg-[#059669]/8 text-[#059669] font-mono font-bold px-3 py-1.5 rounded-lg">
                  {campaign.campaign_number}
                </code>
                <code className="text-xs bg-[#0057D9]/8 text-[#0057D9] font-mono font-bold px-3 py-1.5 rounded-lg">
                  {campaign.reference_number}
                </code>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock size={12} /> Created {fmt(campaign.created_at)}
              </div>
              {campaign.quote_request_id && (
                <Link href={`/admin/quotes/${campaign.quote_request_id}`}
                  className="inline-flex items-center gap-1 text-xs text-[#0057D9] font-semibold hover:underline">
                  <Hash size={11} /> Source quote <ChevronRight size={11} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body: 2-col grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* ══════════ Left column (2/3) ══════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer Information */}
          <Card title="Customer Information" icon={User} color="#0057D9">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Customer Name</FieldLabel>
                <InputField value={customerName} onChange={setCustomerName} placeholder="Full name" />
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <InputField value={company} onChange={setCompany} placeholder="Optional" />
              </div>
            </div>
          </Card>

          {/* Campaign Details */}
          <Card title="Campaign Details" icon={Target} color="#7C3AED">
            <div className="divide-y divide-gray-50">
              <InfoRow label="Campaign Number"
                value={<code className="font-mono font-bold text-[#059669] text-xs bg-[#059669]/8 px-2 py-0.5 rounded-md">{campaign.campaign_number}</code>} />
              <InfoRow label="Reference Number"
                value={<code className="font-mono font-bold text-[#0057D9] text-xs bg-[#0057D9]/8 px-2 py-0.5 rounded-md">{campaign.reference_number}</code>} />
              <InfoRow label="Business Category" value={campaign.business_category} />
            </div>
            <div className="mt-5">
              <FieldLabel>Campaign Objective</FieldLabel>
              <textarea value={objective} onChange={(e) => setObjective(e.target.value)}
                rows={3} placeholder="Describe the campaign objective…"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none
                  focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 resize-none transition-all" />
            </div>
          </Card>

          {/* Package */}
          <Card title="Package" icon={Package} color="#D97706">
            <div className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-orange-50
              border border-amber-100 rounded-2xl p-5">
              <div>
                <div className="text-lg font-heading font-bold text-gray-900">
                  {PACKAGE_LABELS[campaign.package]}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {PACKAGE_PRICES[campaign.package]} <span className="text-gray-400 text-xs">excl. 15% VAT</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Package size={22} className="text-amber-600" />
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card title="Schedule" icon={CalendarDays} color="#059669">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <InputField type="date" value={startDate} onChange={setStartDate} />
              </div>
              <div>
                <FieldLabel>End Date</FieldLabel>
                <InputField type="date" value={endDate} onChange={setEndDate} />
              </div>
            </div>
            {startDate && endDate && (
              <div className="mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3
                flex items-center justify-between gap-3">
                <div className="text-sm text-green-800 font-medium">
                  {fmtDate(startDate)} → {fmtDate(endDate)}
                </div>
                {remaining !== null && (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    {remaining < 0 ? "Ended" : remaining === 0 ? "Today" : `${remaining} days left`}
                  </span>
                )}
              </div>
            )}
          </Card>

          {/* Advertisement Preview */}
          <Card
            title="Advertisement"
            icon={FileVideo}
            color="#0057D9"
            action={
              campaign.ad_file_url && (
                <div className="flex items-center gap-2">
                  <button onClick={refreshAdUrl} disabled={adLoading}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/8 transition-colors"
                    title="Refresh URL">
                    <RefreshCw size={13} className={adLoading ? "animate-spin" : ""} />
                  </button>
                  <button onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9]
                      bg-[#0057D9]/8 hover:bg-[#0057D9]/15 px-3 py-1.5 rounded-lg transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              )
            }
          >
            {campaign.ad_file_url ? (
              <div className="space-y-4">
                {/* File meta row */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 bg-[#0057D9]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileVideo size={16} className="text-[#0057D9]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {campaign.ad_file_name ?? "Advertisement file"}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {isImage ? "Image" : isVideo ? "Video" : "File"} · Inherited from quote request
                    </div>
                  </div>
                </div>

                {/* Preview / player */}
                <AnimatePresence mode="wait">
                  {adLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-48 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <RefreshCw size={20} className="animate-spin" />
                        <span className="text-xs">Loading preview…</span>
                      </div>
                    </motion.div>
                  ) : adUrl && isImage ? (
                    <motion.div key="image" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                      <img src={adUrl} alt={campaign.ad_file_name ?? "Advertisement"}
                        className="w-full max-h-96 object-contain" />
                    </motion.div>
                  ) : adUrl && isVideo ? (
                    <motion.div key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                      <VideoPlayer src={adUrl} fileName={campaign.ad_file_name ?? "Advertisement"} />
                    </motion.div>
                  ) : adUrl ? (
                    <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <div className="text-center text-gray-400 text-sm">
                        <FileVideo size={24} className="mx-auto mb-2 opacity-40" />
                        Preview not available for this file type
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-4">
                <CalendarDays size={16} className="text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 font-semibold">No advertisement uploaded</p>
                  <p className="text-xs text-amber-600 mt-0.5">The customer will send the advertisement separately.</p>
                </div>
              </div>
            )}
          </Card>

          {/* Operator */}
          <Card title="Assigned Operator" icon={UserCog} color="#0057D9">
            <FieldLabel>Operator Name</FieldLabel>
            <InputField value={operator} onChange={setOperator} placeholder="e.g. Yonas Bekele, Team A…" />
            {operator && (
              <p className="text-xs text-gray-400 mt-2">
                Currently assigned to <span className="font-semibold text-gray-600">{operator}</span>
              </p>
            )}
          </Card>

          {/* Internal Notes */}
          <Card title="Internal Notes" icon={MessageSquare} color="#D97706">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5}
              placeholder="Private notes visible only to admin users…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none
                focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/10 resize-none transition-all" />
          </Card>

          {/* Error + Save */}
          <div className="space-y-3">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                  <AlertCircle size={15} /> {error}
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0]
                disabled:opacity-60 text-white font-bold text-sm px-8 py-3 rounded-xl
                transition-colors shadow-md shadow-[#0057D9]/20">
              {saving ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Saving…</>
              ) : saved ? (
                <><CheckCircle size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>

          {/* Campaign Timeline */}
          <Card title="Campaign Timeline" icon={Clock} color="#6B7280">
            {timeline.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No activity recorded yet.</p>
                <p className="text-xs mt-1">Changes will appear here after saving.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Campaign created entry */}
                <div className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                      <Megaphone size={12} className="text-white" />
                    </div>
                    {timeline.length > 0 && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[24px]" />}
                  </div>
                  <div className="pt-0.5 pb-4">
                    <p className="text-sm font-semibold text-gray-800">Campaign created</p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmt(campaign.created_at)}</p>
                  </div>
                </div>

                {timeline.map((entry, i) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#0057D9]/10 flex items-center justify-center flex-shrink-0">
                        <RefreshCw size={11} className="text-[#0057D9]" />
                      </div>
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[24px]" />}
                    </div>
                    <div className="pt-0.5 pb-4 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{entry.action}</p>
                      {entry.detail && (
                        <p className="text-xs text-gray-500 mt-0.5 break-words">{entry.detail}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{fmt(entry.created_at)}</span>
                        {entry.actor && (
                          <span className="text-xs text-gray-300">· {entry.actor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ══════════ Right sidebar (1/3) ══════════ */}
        <div className="space-y-5">

          {/* Campaign Status picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <Megaphone size={13} className="text-[#059669]" />
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider">Campaign Status</h3>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {(Object.keys(CAMPAIGN_STATUS_CONFIG) as CampaignStatus[]).map((s) => {
                const cfg    = CAMPAIGN_STATUS_CONFIG[s];
                const active = campaignStatus === s;
                return (
                  <button key={s} onClick={() => setCampaignStatus(s)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left"
                    style={active
                      ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                      : { borderColor: "#F3F4F6", backgroundColor: "transparent", color: "#6B7280" }}>
                    <span className="text-base leading-none">{cfg.icon}</span>
                    {cfg.label}
                    {active && <CheckCircle size={13} className="ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Status picker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <CreditCard size={13} className="text-[#7C3AED]" />
              <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider">Payment Status</h3>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {(Object.keys(PAYMENT_STATUS_CONFIG) as PaymentStatus[]).map((s) => {
                const cfg    = PAYMENT_STATUS_CONFIG[s];
                const active = paymentStatus === s;
                return (
                  <button key={s} onClick={() => setPaymentStatus(s)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left"
                    style={active
                      ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color }
                      : { borderColor: "#F3F4F6", backgroundColor: "transparent", color: "#6B7280" }}>
                    <span className="text-base leading-none">{cfg.icon}</span>
                    {cfg.label}
                    {active && <CheckCircle size={13} className="ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider">Summary</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: "Package",   value: PACKAGE_LABELS[campaign.package]  },
                { label: "Price",     value: PACKAGE_PRICES[campaign.package]  },
                { label: "Category",  value: campaign.business_category         },
                { label: "Operator",  value: operator || "—"                    },
                { label: "Start",     value: startDate ? fmtDate(startDate) : "—" },
                { label: "End",       value: endDate   ? fmtDate(endDate)   : "—" },
                { label: "Created",   value: fmt(campaign.created_at)           },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-gray-400 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-700 text-right truncate max-w-[140px]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company info card */}
          {(campaign.company || company) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={14} className="text-gray-400" />
                <h3 className="font-heading font-bold text-gray-800 text-xs uppercase tracking-wider">Company</h3>
              </div>
              <p className="text-sm font-semibold text-gray-800">{company || campaign.company}</p>
            </div>
          )}

          {/* Quick save button (sticky-ish) */}
          <button onClick={handleSave} disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0057D9]
              hover:bg-[#003DA0] disabled:opacity-60 text-white font-bold text-sm py-3
              rounded-xl transition-colors shadow-md shadow-[#0057D9]/20">
            {saving ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Saving…</>
            ) : saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
