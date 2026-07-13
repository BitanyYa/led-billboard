"use client";

import { useEffect, useState, useRef } from "react";
import {
  Save, CheckCircle, AlertCircle, Upload, X,
  Building2, Phone, Clock, Share2, MapPin,
  Globe, Image as ImageIcon, Video, MonitorPlay,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getAdminClient } from "@/lib/supabase-admin";
import type { SettingsMap } from "@/types/admin";

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCn =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all bg-white";

const urlCn = inputCn + " font-mono";

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={type === "url" || type === "email" ? urlCn : inputCn}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={inputCn + " resize-none"}
    />
  );
}

// Card wrapper for each section
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/60">
        <div className="w-8 h-8 bg-[#0057D9]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={15} className="text-[#0057D9]" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Logo uploader ────────────────────────────────────────────────────────────

function LogoUploader({
  logoUrl,
  onChange,
}: {
  logoUrl: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be under 2 MB.");
      return;
    }
    setUploadError("");
    setUploading(true);

    const db = getAdminClient();
    const ext = file.name.split(".").pop() ?? "png";
    const path = `logos/logo_${Date.now()}.${ext}`;

    const { error: uploadErr } = await db.storage
      .from("public-assets")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadErr) {
      setUploadError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data } = db.storage.from("public-assets").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-16 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo preview"
              className="max-h-14 max-w-[88px] object-contain"
            />
          ) : (
            <ImageIcon size={20} className="text-gray-300" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#0057D9]/10 hover:bg-[#0057D9]/15 disabled:opacity-50 text-[#0057D9] font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : "Upload Image"}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 inline-flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
            >
              <X size={12} /> Remove
            </button>
          )}
          <p className="text-[11px] text-gray-400">PNG, JPG, SVG — max 2 MB</p>
        </div>
      </div>

      {/* Manual URL fallback */}
      <input
        type="url"
        value={logoUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a logo URL directly…"
        className={urlCn}
      />

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {uploadError}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Video uploader ───────────────────────────────────────────────────────────

function VideoUploader({
  videoUrl,
  onChange,
}: {
  videoUrl: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setUploadError("Please select a video file (MP4, WebM, etc.).");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Video must be under 50 MB.");
      return;
    }
    setUploadError("");
    setUploading(true);

    const db = getAdminClient();
    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `videos/hero_video_${Date.now()}.${ext}`;

    const { error: uploadErr } = await db.storage
      .from("public-assets")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadErr) {
      setUploadError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data } = db.storage.from("public-assets").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex items-start gap-4">
        <div className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover rounded-xl"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Video size={22} className="text-gray-300" />
          )}
        </div>

        <div className="flex-1 space-y-2 pt-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#0057D9]/10 hover:bg-[#0057D9]/15 disabled:opacity-50 text-[#0057D9] font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : "Upload Video"}
          </button>
          {videoUrl && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 inline-flex items-center gap-1 text-gray-400 hover:text-red-500 text-xs transition-colors"
            >
              <X size={12} /> Remove
            </button>
          )}
          <p className="text-[11px] text-gray-400">MP4, WebM — max 50 MB</p>
        </div>
      </div>

      {/* Manual URL fallback */}
      <input
        type="url"
        value={videoUrl}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste a video URL directly…"
        className={urlCn}
      />

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {uploadError}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [vals, setVals] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Helper: get / set a single key
  const get = (key: string, fallback = "") => vals[key] ?? fallback;
  const set = (key: string) => (v: string) =>
    setVals((prev) => ({ ...prev, [key]: v }));

  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const { data } = await db.from("settings").select("key, value");
      if (data) {
        const map: SettingsMap = {};
        data.forEach((r: { key: string; value: string }) => {
          map[r.key] = r.value;
        });
        setVals(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const db = getAdminClient();

    // Build upsert rows only for keys we manage here
    const rows = Object.entries(vals).map(([key, value]) => ({
      key,
      value: value ?? "",
      // label / group_name are only needed for new rows — existing rows keep theirs
      label: key,
      group_name: "general",
      updated_at: new Date().toISOString(),
    }));

    const { error: err } = await db
      .from("settings")
      .upsert(rows, { onConflict: "key" });

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  if (loading) return <LoadingSpinner text="Loading settings…" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Page header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">
          Business Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Changes are reflected on the public website immediately after saving.
        </p>
      </div>

      {/* ── 1. Identity ─────────────────────────────────────────────────── */}
      <Section
        icon={Building2}
        title="Company Identity"
        description="Name, logo, and public description"
      >
        <Field label="Company Name">
          <TextInput
            value={get("company_name")}
            onChange={set("company_name")}
            placeholder="AWLO Advertising"
          />
        </Field>

        <Field
          label="Logo"
          hint="Upload a new logo or paste a hosted URL. Used in the Navbar and Footer."
        >
          <LogoUploader
            logoUrl={get("logo_url")}
            onChange={set("logo_url")}
          />
        </Field>

        <Field label="Company Tagline">
          <TextInput
            value={get("company_tagline")}
            onChange={set("company_tagline")}
            placeholder="Ethiopia's premier LED billboard advertising company"
          />
        </Field>

        <Field label="Company Description">
          <TextArea
            value={get("company_description")}
            onChange={set("company_description")}
            placeholder="Short description shown in the footer…"
            rows={3}
          />
        </Field>
      </Section>

      {/* ── 2. Contact ──────────────────────────────────────────────────── */}
      <Section
        icon={Phone}
        title="Contact Information"
        description="Phone numbers, email, WhatsApp, and address"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Primary Phone">
            <TextInput
              value={get("phone")}
              onChange={set("phone")}
              placeholder="+251 959 15 55 55"
            />
          </Field>

          <Field label="Secondary Phone" hint="Optional — leave blank to hide">
            <TextInput
              value={get("phone_secondary")}
              onChange={set("phone_secondary")}
              placeholder="+251 ..."
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="WhatsApp Number" hint="Include country code, digits only">
            <TextInput
              value={get("whatsapp")}
              onChange={set("whatsapp")}
              placeholder="251959155555"
            />
          </Field>

          <Field label="Email Address">
            <TextInput
              value={get("email")}
              onChange={set("email")}
              placeholder="hello@example.com"
              type="email"
            />
          </Field>
        </div>

        <Field label="Office Address">
          <TextInput
            value={get("address")}
            onChange={set("address")}
            placeholder="Street, City, Country"
          />
        </Field>
      </Section>

      {/* ── 3. Location ─────────────────────────────────────────────────── */}
      <Section
        icon={MapPin}
        title="Google Maps"
        description="Links used for the map pin and the embedded iframe"
      >
        <Field label="Google Maps Link" hint="The shareable link visitors open in Maps">
          <TextInput
            value={get("maps_url")}
            onChange={set("maps_url")}
            placeholder="https://maps.google.com/…"
            type="url"
          />
        </Field>

        <Field
          label="Google Maps Embed URL"
          hint="Paste the src URL from the Google Maps 'Embed a map' iframe code"
        >
          <TextArea
            value={get("maps_embed")}
            onChange={set("maps_embed")}
            placeholder="https://www.google.com/maps/embed?pb=…"
            rows={2}
          />
        </Field>
      </Section>

      {/* ── 4. Business Hours ───────────────────────────────────────────── */}
      <Section
        icon={Clock}
        title="Business Hours"
        description="Shown in the footer — write each line as you want it displayed"
      >
        <Field label="Weekdays">
          <TextInput
            value={get("hours_weekday")}
            onChange={set("hours_weekday")}
            placeholder="Mon – Fri: 8:00 AM – 6:00 PM"
          />
        </Field>

        <Field label="Saturday">
          <TextInput
            value={get("hours_saturday")}
            onChange={set("hours_saturday")}
            placeholder="Sat: 9:00 AM – 4:00 PM"
          />
        </Field>

        <Field label="Sunday">
          <TextInput
            value={get("hours_sunday")}
            onChange={set("hours_sunday")}
            placeholder="Closed"
          />
        </Field>
      </Section>

      {/* ── 5. Social Media ─────────────────────────────────────────────── */}
      <Section
        icon={Share2}
        title="Social Media"
        description="Profile URLs — leave blank to hide the icon"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Facebook">
            <TextInput
              value={get("facebook")}
              onChange={set("facebook")}
              placeholder="https://facebook.com/…"
              type="url"
            />
          </Field>

          <Field label="Instagram">
            <TextInput
              value={get("instagram")}
              onChange={set("instagram")}
              placeholder="https://instagram.com/…"
              type="url"
            />
          </Field>

          <Field label="LinkedIn">
            <TextInput
              value={get("linkedin")}
              onChange={set("linkedin")}
              placeholder="https://linkedin.com/…"
              type="url"
            />
          </Field>

          <Field label="TikTok">
            <TextInput
              value={get("tiktok")}
              onChange={set("tiktok")}
              placeholder="https://tiktok.com/@…"
              type="url"
            />
          </Field>

          <Field label="YouTube">
            <TextInput
              value={get("youtube")}
              onChange={set("youtube")}
              placeholder="https://youtube.com/@…"
              type="url"
            />
          </Field>

          <Field label="Twitter / X" hint="Optional">
            <TextInput
              value={get("twitter")}
              onChange={set("twitter")}
              placeholder="https://x.com/…"
              type="url"
            />
          </Field>
        </div>
      </Section>

      {/* ── 6. Website ──────────────────────────────────────────────────── */}
      <Section
        icon={Globe}
        title="Website"
        description="Your canonical public website URL"
      >
        <Field label="Website URL">
          <TextInput
            value={get("website")}
            onChange={set("website")}
            placeholder="https://www.example.com"
            type="url"
          />
        </Field>
      </Section>

      {/* ── 7. Hero Section ─────────────────────────────────────────────── */}
      <Section
        icon={MonitorPlay}
        title="Hero Section"
        description="Content displayed in the large hero area at the top of the homepage"
      >
        <Field
          label="Billboard Video"
          hint="Shown looping inside the billboard screen mockup. Upload an MP4/WebM or paste a hosted URL. Falls back to /billboard-video.mp4 if empty."
        >
          <VideoUploader
            videoUrl={get("hero_video_url")}
            onChange={set("hero_video_url")}
          />
        </Field>
      </Section>

      {/* ── Sticky save bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm truncate">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}
            {saved && !error && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <CheckCircle size={15} />
                Settings saved — live on the website now!
              </div>
            )}
            {!error && !saved && (
              <p className="text-xs text-gray-400">
                Unsaved changes will not be published.
              </p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md flex-shrink-0"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
