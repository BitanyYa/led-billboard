"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Star, Eye, EyeOff,
  Package, GripVertical, X, Save, AlertTriangle,
  Check, Clock, Zap, BarChart2,
} from "lucide-react";
import { getAdminClient } from "@/lib/supabase-admin";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import EmptyState from "@/components/admin/EmptyState";
import type { Package as Pkg, PackageFormData } from "@/types/admin";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return "ETB " + n.toLocaleString("en-ET", { minimumFractionDigits: 2 });
}

const inputCn =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none " +
  "focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all bg-white";

const labelCn = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

const BLANK: PackageFormData = {
  name: "",
  description: "",
  price: 0,
  duration: "",
  advertisement_length: 20,
  displays_per_day: 40,
  bonus_minutes: 0,
  featured: false,
  visible: true,
  sort_order: 0,
};

// ─── Confirm-delete modal ────────────────────────────────────────────────────

function DeleteModal({
  pkg,
  onConfirm,
  onCancel,
  loading,
}: {
  pkg: Pkg;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-gray-900">Delete Package?</h2>
            <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          You are about to permanently delete <span className="font-semibold text-gray-900">{pkg.name}</span>.
          Any campaigns referencing this package by name will be unaffected.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Package Form Modal ──────────────────────────────────────────────────────

function PackageModal({
  initial,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial: PackageFormData | null;
  onSave: (data: PackageFormData) => void;
  onClose: () => void;
  saving: boolean;
  error: string;
}) {
  const isEdit = initial !== null;
  const [form, setForm] = useState<PackageFormData>(initial ?? BLANK);
  // Separate raw string for price so the user can type freely (e.g. "ETB 47,036")
  const [priceRaw, setPriceRaw] = useState<string>(
    initial && initial.price ? String(initial.price) : ""
  );

  const set = <K extends keyof PackageFormData>(k: K, v: PackageFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // On blur, parse whatever the user typed into a plain number for the DB
  const handlePriceBlur = () => {
    const num = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));
    set("price", isNaN(num) ? 0 : num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0057D9]/10 rounded-xl flex items-center justify-center">
              <Package size={15} className="text-[#0057D9]" />
            </div>
            <h2 className="font-heading font-bold text-gray-900">
              {isEdit ? "Edit Package" : "New Package"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertTriangle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className={labelCn}>Package Name *</label>
              <input
                className={inputCn}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. 3 Months"
              />
            </div>

            {/* Price */}
            <div>
              <label className={labelCn}>Price (ETB) *</label>
              <input
                type="text"
                className={inputCn}
                value={priceRaw}
                onChange={(e) => setPriceRaw(e.target.value)}
                onBlur={handlePriceBlur}
                placeholder="e.g. 47,036 or ETB 291,500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className={labelCn}>Duration *</label>
              <input
                className={inputCn}
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 3 Months"
              />
            </div>

            {/* Ad length */}
            <div>
              <label className={labelCn}>Advertisement Length (seconds) *</label>
              <input
                type="number"
                min={1}
                className={inputCn}
                value={form.advertisement_length}
                onChange={(e) => set("advertisement_length", parseInt(e.target.value) || 1)}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
              />
            </div>

            {/* Displays per day */}
            <div>
              <label className={labelCn}>Displays Per Day *</label>
              <input
                type="number"
                min={1}
                className={inputCn}
                value={form.displays_per_day}
                onChange={(e) => set("displays_per_day", parseInt(e.target.value) || 1)}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
              />
            </div>

            {/* Bonus minutes */}
            <div>
              <label className={labelCn}>Bonus Minutes</label>
              <input
                type="number"
                min={0}
                className={inputCn}
                value={form.bonus_minutes}
                onChange={(e) => set("bonus_minutes", parseInt(e.target.value) || 0)}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                placeholder="0"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Extra airtime bonus shown on the pricing card. e.g. 5 = &quot;+5 min bonus airtime&quot;
              </p>
            </div>

            {/* Sort order */}
            <div>
              <label className={labelCn}>Sort Order</label>
              <input
                type="number"
                min={0}
                className={inputCn}
                value={form.sort_order}
                onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className={labelCn}>Description</label>
              <textarea
                rows={3}
                className={inputCn + " resize-none"}
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Brief description shown on the pricing card…"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            {/* Featured */}
            <button
              type="button"
              onClick={() => set("featured", !form.featured)}
              className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                form.featured
                  ? "border-[#FFD400] bg-[#FFFBEB]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${form.featured ? "bg-[#FFD400]/30" : "bg-gray-200"}`}>
                <Star size={15} className={form.featured ? "text-[#D9A000]" : "text-gray-400"} fill={form.featured ? "currentColor" : "none"} />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Featured</div>
                <div className="text-[11px] text-gray-500">Highlighted on the homepage</div>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.featured ? "border-[#D9A000] bg-[#FFD400]" : "border-gray-300"}`}>
                {form.featured && <Check size={11} className="text-gray-900" strokeWidth={3} />}
              </div>
            </button>

            {/* Visible */}
            <button
              type="button"
              onClick={() => set("visible", !form.visible)}
              className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                form.visible
                  ? "border-[#0057D9] bg-[#EFF6FF]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${form.visible ? "bg-[#0057D9]/15" : "bg-gray-200"}`}>
                {form.visible
                  ? <Eye size={15} className="text-[#0057D9]" />
                  : <EyeOff size={15} className="text-gray-400" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Visible</div>
                <div className="text-[11px] text-gray-500">Shown on the public website</div>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.visible ? "border-[#0057D9] bg-[#0057D9]" : "border-gray-300"}`}>
                {form.visible && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim() || !form.duration.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Save size={14} />}
            {isEdit ? "Save Changes" : "Create Package"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Package card ────────────────────────────────────────────────────────────

function PackageCard({
  pkg,
  onEdit,
  onDelete,
  onToggleVisible,
  onToggleFeatured,
}: {
  pkg: Pkg;
  onEdit: (p: Pkg) => void;
  onDelete: (p: Pkg) => void;
  onToggleVisible: (p: Pkg) => void;
  onToggleFeatured: (p: Pkg) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
        pkg.featured ? "border-[#FFD400]/60 ring-2 ring-[#FFD400]/20" : "border-gray-100"
      } ${!pkg.visible ? "opacity-60" : ""}`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 bg-gray-50/60">
        <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-auto">
          #{pkg.sort_order} · {pkg.duration}
        </span>

        {pkg.featured && (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFD400] text-gray-900">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
        {!pkg.visible && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
            <EyeOff size={9} /> Hidden
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-0.5">{pkg.name}</h3>
        {pkg.description && (
          <p className="text-sm text-gray-500 mb-4 leading-snug line-clamp-2">{pkg.description}</p>
        )}

        <div className="text-2xl font-extrabold text-[#0057D9] mb-4 font-heading">
          {formatPrice(pkg.price)}
          <span className="text-xs font-medium text-gray-400 ml-1">excl. VAT</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center">
            <Clock size={13} className="text-[#0057D9]" />
            <span className="text-[11px] font-bold text-gray-700">{pkg.advertisement_length}s</span>
            <span className="text-[10px] text-gray-400">Ad Length</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center">
            <Zap size={13} className="text-[#0057D9]" />
            <span className="text-[11px] font-bold text-gray-700">{pkg.displays_per_day}×</span>
            <span className="text-[10px] text-gray-400">Per Day</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center">
            <BarChart2 size={13} className="text-[#0057D9]" />
            <span className="text-[11px] font-bold text-gray-700">
              {(pkg.displays_per_day * (
                pkg.duration.includes("Year") ? 365
                : pkg.duration.includes("6") ? 180
                : pkg.duration.includes("3") ? 90
                : pkg.duration.includes("Month") ? 30
                : 7
              )).toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400">Total Plays</span>
          </div>
        </div>

        {/* Bonus badge */}
        {pkg.bonus_minutes > 0 && (
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-[#FFD400]/15 border border-[#FFD400]/40">
            <Star size={12} className="text-[#D9A000] flex-shrink-0" fill="currentColor" />
            <span className="text-[11px] font-bold text-[#B8860B]">
              +{pkg.bonus_minutes} min bonus airtime included
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onToggleFeatured(pkg)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              pkg.featured
                ? "border-[#FFD400]/60 bg-[#FFFBEB] text-[#D9A000] hover:bg-[#FFF3CD]"
                : "border-gray-200 text-gray-600 hover:border-[#FFD400]/50 hover:bg-[#FFFBEB] hover:text-[#D9A000]"
            }`}
          >
            <Star size={12} fill={pkg.featured ? "currentColor" : "none"} />
            {pkg.featured ? "Unfeature" : "Feature"}
          </button>

          <button
            onClick={() => onToggleVisible(pkg)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              pkg.visible
                ? "border-[#0057D9]/30 bg-[#EFF6FF] text-[#0057D9] hover:bg-blue-100"
                : "border-gray-200 text-gray-600 hover:border-[#0057D9]/30 hover:bg-[#EFF6FF] hover:text-[#0057D9]"
            }`}
          >
            {pkg.visible ? <Eye size={12} /> : <EyeOff size={12} />}
            {pkg.visible ? "Visible" : "Hidden"}
          </button>

          <button
            onClick={() => onEdit(pkg)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={12} /> Edit
          </button>

          <button
            onClick={() => onDelete(pkg)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PackagesPage() {
  const [packages,    setPackages]    = useState<Pkg[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Pkg | null>(null);
  const [deleteTarget,setDeleteTarget]= useState<Pkg | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [modalError,  setModalError]  = useState("");
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  // ── load ──────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();
    const { data } = await db
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setPackages((data ?? []) as Pkg[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── toast helper ──────────────────────────────────────────
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── open modal ────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setModalError("");
    setModalOpen(true);
  };

  const openEdit = (pkg: Pkg) => {
    setEditTarget(pkg);
    setModalError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditTarget(null);
    setModalError("");
  };

  // ── save (create / update) ────────────────────────────────
  const handleSave = async (data: PackageFormData) => {
    if (!data.name.trim() || !data.duration.trim()) {
      setModalError("Name and Duration are required.");
      return;
    }
    setSaving(true);
    setModalError("");
    const db = getAdminClient();

    if (editTarget) {
      const { error } = await db
        .from("packages")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", editTarget.id);
      if (error) { setModalError(error.message); setSaving(false); return; }
      showToast("Package updated successfully.");
    } else {
      const { error } = await db.from("packages").insert(data);
      if (error) { setModalError(error.message); setSaving(false); return; }
      showToast("Package created successfully.");
    }

    setSaving(false);
    setModalOpen(false);
    setEditTarget(null);
    load();
  };

  // ── delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const db = getAdminClient();
    const { error } = await db.from("packages").delete().eq("id", deleteTarget.id);
    if (error) { showToast(error.message, false); }
    else { showToast("Package deleted."); }
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  // ── inline toggles ────────────────────────────────────────
  const toggleField = async (pkg: Pkg, field: "visible" | "featured") => {
    const db = getAdminClient();
    const { error } = await db
      .from("packages")
      .update({ [field]: !pkg[field], updated_at: new Date().toISOString() })
      .eq("id", pkg.id);
    if (error) { showToast(error.message, false); return; }
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, [field]: !p[field] } : p))
    );
  };

  // ── render ────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Packages</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {packages.length} package{packages.length !== 1 ? "s" : ""} ·{" "}
            {packages.filter((p) => p.visible).length} visible ·{" "}
            {packages.filter((p) => p.featured).length} featured
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors shadow-sm"
        >
          <Plus size={16} /> New Package
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-800">
        <Package size={16} className="flex-shrink-0 mt-0.5 text-[#0057D9]" />
        <p>
          Packages are shown on the public homepage in <strong>sort order</strong>.
          Toggle <strong>Visible</strong> to hide a package without deleting it.
          Toggle <strong>Featured</strong> to highlight it with a special style.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <EmptyState
            icon={Package}
            title="No packages yet"
            description="Create your first pricing package to display it on the homepage."
          />
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors"
          >
            <Plus size={15} /> New Package
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onToggleVisible={(p) => toggleField(p, "visible")}
                onToggleFeatured={(p) => toggleField(p, "featured")}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <PackageModal
            initial={editTarget
              ? {
                  name: editTarget.name,
                  description: editTarget.description,
                  price: editTarget.price,
                  duration: editTarget.duration,
                  advertisement_length: editTarget.advertisement_length,
                  displays_per_day: editTarget.displays_per_day,
                  bonus_minutes: editTarget.bonus_minutes,
                  featured: editTarget.featured,
                  visible: editTarget.visible,
                  sort_order: editTarget.sort_order,
                }
              : null}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
            error={modalError}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            pkg={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold ${
              toast.ok ? "bg-gray-900 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.ok
              ? <Check size={15} className="text-green-400" />
              : <AlertTriangle size={15} className="text-red-200" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
