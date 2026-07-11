"use client";

import { useEffect, useState } from "react";
import {
  Save, CheckCircle, AlertCircle,
  Globe, Phone, Clock, Share2,
  Building2, Monitor, Tag, Layers,
} from "lucide-react";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { getAdminClient } from "@/lib/supabase-admin";
import type { Setting } from "@/types/admin";

const GROUP_META: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  company:   { label: "Company",              icon: Building2, description: "Company name, tagline, and description shown throughout the site" },
  contact:   { label: "Contact Information",  icon: Phone,     description: "Phone, email, WhatsApp, Telegram, address, and Google Maps links" },
  hours:     { label: "Business Hours",       icon: Clock,     description: "Opening hours displayed in the footer" },
  social:    { label: "Social Media",         icon: Share2,    description: "Social media profile URLs" },
  hero:      { label: "Hero Section",         icon: Layers,    description: "Headline, subheadline, badge text, and stat numbers on the homepage hero" },
  about:     { label: "About Section",        icon: Building2, description: "Company overview, mission, and vision text" },
  billboard: { label: "Billboard Specs",      icon: Monitor,   description: "Technical specifications displayed on the billboard section" },
  packages:  { label: "Advertising Packages", icon: Tag,       description: "Prices, taglines, and shared package text" },
  general:   { label: "General",              icon: Globe,     description: "Website URL and other general settings" },
};

// Keys that should render as a textarea (long text)
const TEXTAREA_KEYS = new Set([
  "company_description", "about_body", "about_mission", "about_vision",
  "hero_subheadline",
]);

// Keys that should render as a URL input
const URL_KEYS = new Set([
  "maps_url", "maps_embed", "facebook", "twitter", "instagram",
  "linkedin", "website",
]);

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values,   setValues]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const { data } = await db
        .from("settings")
        .select("*")
        .order("group_name")
        .order("key");
      if (data) {
        setSettings(data as Setting[]);
        const map: Record<string, string> = {};
        data.forEach((s) => { map[s.key] = s.value; });
        setValues(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const db = getAdminClient();
    const updates = settings.map((s) => ({
      key:        s.key,
      value:      values[s.key] ?? s.value,
      label:      s.label,
      group_name: s.group_name,
      updated_at: new Date().toISOString(),
    }));
    const { error: err } = await db
      .from("settings")
      .upsert(updates, { onConflict: "key" });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <LoadingSpinner text="Loading settings…" />;

  // Order groups logically
  const GROUP_ORDER = ["company", "contact", "hours", "social", "hero", "about", "billboard", "packages", "general"];
  const groups = GROUP_ORDER.filter((g) => settings.some((s) => s.group_name === g));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Business Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          All changes are reflected on the public website immediately after saving.
        </p>
      </div>

      {groups.map((group) => {
        const meta = GROUP_META[group] ?? { label: group, icon: Globe, description: "" };
        const Icon = meta.icon;
        const groupSettings = settings.filter((s) => s.group_name === group);

        return (
          <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Group header */}
            <div className="flex items-start gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
              <div className="w-8 h-8 bg-[#0057D9]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={15} className="text-[#0057D9]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-gray-800 text-sm">{meta.label}</h2>
                {meta.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{meta.description}</p>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="p-6 space-y-5">
              {groupSettings.map((s) => (
                <div key={s.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {s.label}
                  </label>

                  {TEXTAREA_KEYS.has(s.key) ? (
                    <textarea
                      value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      rows={3}
                      placeholder={s.label}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all resize-none"
                    />
                  ) : URL_KEYS.has(s.key) ? (
                    <input
                      type="url"
                      value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      placeholder={s.label}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all font-mono"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[s.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                      placeholder={s.label}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Sticky save bar */}
      <div className="sticky bottom-4 bg-white rounded-2xl border border-gray-100 shadow-lg px-6 py-4 flex items-center justify-between gap-4">
        <div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          {saved && !error && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle size={15} /> Settings saved — live on the website now!
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0057D9] hover:bg-[#003DA0] disabled:bg-[#0057D9]/60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md ml-auto flex-shrink-0"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            <><Save size={16} /> Save All Settings</>
          )}
        </button>
      </div>
    </div>
  );
}
