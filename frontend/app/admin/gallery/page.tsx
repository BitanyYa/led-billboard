"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  X, Save, AlertTriangle, Check, Upload,
  Image as ImageIcon, Video, Images,
  Filter,
} from "lucide-react";
import { getAdminClient } from "@/lib/supabase-admin";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import EmptyState from "@/components/admin/EmptyState";
import type { GalleryItem, GalleryItemFormData } from "@/types/admin";
import { GALLERY_CATEGORIES } from "@/types/admin";

// ─── constants ───────────────────────────────────────────────────────────────

const BUCKET = "gallery";
const ACCEPTED = "image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo";

/** Tell Next.js to bust the homepage cache so the public gallery updates immediately. */
async function revalidatePublicGallery() {
  try {
    await fetch("/api/revalidate-gallery", { method: "POST" });
  } catch {
    // Non-fatal — the public page will still update on the next natural revalidation
  }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeFromMime(mime: string): "image" | "video" {
  return mime.startsWith("video/") ? "video" : "image";
}

const inputCn =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none " +
  "focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/15 transition-all bg-white";
const labelCn = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  item, onConfirm, onCancel, loading,
}: {
  item: GalleryItem; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-gray-900">Delete Item?</h2>
            <p className="text-sm text-gray-500 mt-0.5">The file will be removed from storage too.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          You are about to permanently delete{" "}
          <span className="font-semibold text-gray-900">{item.title}</span>.
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading
              ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Upload / Edit Modal ──────────────────────────────────────────────────────

function GalleryModal({
  editTarget, onSave, onClose, saving, error,
}: {
  editTarget: GalleryItem | null;
  onSave: (form: GalleryItemFormData, file: File | null) => void;
  onClose: () => void;
  saving: boolean;
  error: string;
}) {
  const isEdit = editTarget !== null;
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<GalleryItemFormData>({
    title:      editTarget?.title      ?? "",
    category:   editTarget?.category   ?? "General",
    visible:    editTarget?.visible    ?? true,
    sort_order: editTarget?.sort_order ?? 0,
  });
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(editTarget?.file_url ?? null);
  const [dragOver, setDragOver] = useState(false);

  const set = <K extends keyof GalleryItemFormData>(k: K, v: GalleryItemFormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!form.title) set("title", f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const fileType = file ? fileTypeFromMime(file.type) : editTarget?.file_type ?? "image";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0057D9]/10 rounded-xl flex items-center justify-center">
              <Images size={15} className="text-[#0057D9]" />
            </div>
            <h2 className="font-heading font-bold text-gray-900">
              {isEdit ? "Edit Gallery Item" : "Upload File"}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertTriangle size={14} className="flex-shrink-0" />{error}
            </div>
          )}

          {/* Drop zone (always shown; on edit shows current file as preview) */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[180px] overflow-hidden
              ${dragOver ? "border-[#0057D9] bg-[#EFF6FF]" : "border-gray-200 bg-gray-50 hover:border-[#0057D9]/50 hover:bg-[#F5F9FF]"}`}
          >
            {preview ? (
              fileType === "video" ? (
                <video src={preview} className="max-h-48 rounded-xl object-contain" controls={false} muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain" />
              )
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
                <Upload size={28} />
                <span className="text-sm font-medium">Drop a file here or click to browse</span>
                <span className="text-xs">Images: JPEG, PNG, GIF, WebP · Videos: MP4, WebM, MOV</span>
              </div>
            )}
            {preview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all opacity-0 hover:opacity-100 rounded-2xl">
                <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1.5 rounded-lg">
                  {isEdit ? "Replace file" : "Change file"}
                </span>
              </div>
            )}
            <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          {file && (
            <p className="text-xs text-gray-500 -mt-3 text-center">
              {file.name} · {formatBytes(file.size)}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className={labelCn}>Title *</label>
              <input className={inputCn} value={form.title}
                onChange={(e) => set("title", e.target.value)} placeholder="e.g. Night View — Bole Road" />
            </div>

            {/* Category */}
            <div>
              <label className={labelCn}>Category</label>
              <select className={inputCn} value={form.category}
                onChange={(e) => set("category", e.target.value)}>
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div>
              <label className={labelCn}>Sort Order</label>
              <input type="number" min={0} className={inputCn} value={form.sort_order}
                onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()} />
            </div>
          </div>

          {/* Visible toggle */}
          <button type="button" onClick={() => set("visible", !form.visible)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 transition-all text-left
              ${form.visible ? "border-[#0057D9] bg-[#EFF6FF]" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${form.visible ? "bg-[#0057D9]/15" : "bg-gray-200"}`}>
              {form.visible ? <Eye size={15} className="text-[#0057D9]" /> : <EyeOff size={15} className="text-gray-400" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Visible</div>
              <div className="text-[11px] text-gray-500">Show on the public gallery</div>
            </div>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${form.visible ? "border-[#0057D9] bg-[#0057D9]" : "border-gray-300"}`}>
              {form.visible && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(form, file)}
            disabled={saving || !form.title.trim() || (!isEdit && !file)}
            className="px-5 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors disabled:opacity-60 flex items-center gap-2">
            {saving
              ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <Save size={14} />}
            {isEdit ? "Save Changes" : "Upload"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Gallery Item Card ────────────────────────────────────────────────────────

function GalleryCard({
  item, onEdit, onDelete, onToggleVisible,
}: {
  item: GalleryItem;
  onEdit: (i: GalleryItem) => void;
  onDelete: (i: GalleryItem) => void;
  onToggleVisible: (i: GalleryItem) => void;
}) {
  return (
    <motion.div
      layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
        ${!item.visible ? "opacity-60" : "border-gray-100"}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {item.file_type === "video" ? (
          <video
            src={item.file_url}
            className="w-full h-full object-cover"
            muted playsInline
            onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
            onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.file_url} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
            ${item.file_type === "video" ? "bg-purple-600 text-white" : "bg-[#0057D9] text-white"}`}>
            {item.file_type === "video" ? <Video size={9} /> : <ImageIcon size={9} />}
            {item.file_type}
          </span>
          {!item.visible && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800/70 text-white">
              <EyeOff size={9} /> Hidden
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0057D9]">
            {item.category}
          </span>
        </div>
        <h3 className="font-heading font-bold text-sm text-gray-900 truncate mb-1">{item.title}</h3>
        {item.file_size && (
          <p className="text-xs text-gray-400 mb-3">{formatBytes(item.file_size)}</p>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onToggleVisible(item)}
            className={`flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-semibold border transition-all
              ${item.visible
                ? "border-[#0057D9]/30 bg-[#EFF6FF] text-[#0057D9] hover:bg-blue-100"
                : "border-gray-200 text-gray-600 hover:border-[#0057D9]/30 hover:bg-[#EFF6FF] hover:text-[#0057D9]"}`}>
            {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
            {item.visible ? "Shown" : "Hidden"}
          </button>

          <button onClick={() => onEdit(item)}
            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
            <Pencil size={12} /> Edit
          </button>

          <button onClick={() => onDelete(item)}
            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-semibold border border-red-100 text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [items,        setItems]        = useState<GalleryItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [modalError,   setModalError]   = useState("");
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [filterCat,    setFilterCat]    = useState("All");
  const [filterType,   setFilterType]   = useState("All");

  // ── load ────────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const db = getAdminClient();
    const { data } = await db
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setItems((data ?? []) as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── toast ───────────────────────────────────────────────────────────────────
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── open / close modal ───────────────────────────────────────────────────────
  const openCreate = () => { setEditTarget(null); setModalError(""); setModalOpen(true); };
  const openEdit   = (item: GalleryItem) => { setEditTarget(item); setModalError(""); setModalOpen(true); };
  const closeModal = () => { if (saving) return; setModalOpen(false); setEditTarget(null); setModalError(""); };

  // ── save ────────────────────────────────────────────────────────────────────
  const handleSave = async (form: GalleryItemFormData, file: File | null) => {
    if (!form.title.trim()) { setModalError("Title is required."); return; }
    if (!editTarget && !file) { setModalError("Please select a file to upload."); return; }

    setSaving(true);
    setModalError("");
    const db = getAdminClient();

    let fileUrl        = editTarget?.file_url        ?? "";
    let storagePath    = editTarget?.storage_path    ?? "";
    let fileType       = editTarget?.file_type       ?? ("image" as "image" | "video");
    let fileName       = editTarget?.file_name       ?? "";
    let fileSize: number | null = editTarget?.file_size ?? null;

    // Upload new file if provided
    if (file) {
      const ext  = file.name.split(".").pop() ?? "bin";
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await db.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) { setModalError(upErr.message); setSaving(false); return; }

      const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
      fileUrl     = urlData.publicUrl;
      storagePath = path;
      fileType    = fileTypeFromMime(file.type);
      fileName    = file.name;
      fileSize    = file.size;

      // Delete old file if replacing
      if (editTarget?.storage_path) {
        await db.storage.from(BUCKET).remove([editTarget.storage_path]);
      }
    }

    const payload = {
      ...form,
      file_url:     fileUrl,
      storage_path: storagePath,
      file_type:    fileType,
      file_name:    fileName,
      file_size:    fileSize,
      updated_at:   new Date().toISOString(),
    };

    if (editTarget) {
      const { error } = await db.from("gallery_items").update(payload).eq("id", editTarget.id);
      if (error) { setModalError(error.message); setSaving(false); return; }
      showToast("Gallery item updated.");
    } else {
      const { error } = await db.from("gallery_items").insert(payload);
      if (error) { setModalError(error.message); setSaving(false); return; }
      showToast("File uploaded successfully.");
    }

    setSaving(false);
    setModalOpen(false);
    setEditTarget(null);
    load();
    revalidatePublicGallery();
  };

  // ── delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const db = getAdminClient();
    // Remove from storage first (ignore errors — row delete is the source of truth)
    if (deleteTarget.storage_path) {
      await db.storage.from(BUCKET).remove([deleteTarget.storage_path]);
    }
    const { error } = await db.from("gallery_items").delete().eq("id", deleteTarget.id);
    if (error) { showToast(error.message, false); }
    else        { showToast("Item deleted."); }
    setDeleting(false);
    setDeleteTarget(null);
    load();
    revalidatePublicGallery();
  };

  // ── toggle visible ───────────────────────────────────────────────────────────
  const toggleVisible = async (item: GalleryItem) => {
    const db = getAdminClient();
    const { error } = await db
      .from("gallery_items")
      .update({ visible: !item.visible, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) { showToast(error.message, false); return; }
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visible: !i.visible } : i));
    revalidatePublicGallery();
  };

  // ── filtered list ────────────────────────────────────────────────────────────
  const displayed = items.filter((i) => {
    if (filterCat  !== "All" && i.category  !== filterCat)  return false;
    if (filterType !== "All" && i.file_type !== filterType) return false;
    return true;
  });

  const visibleCount = items.filter((i) => i.visible).length;
  const imageCount   = items.filter((i) => i.file_type === "image").length;
  const videoCount   = items.filter((i) => i.file_type === "video").length;

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Gallery</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""} ·{" "}
            {imageCount} image{imageCount !== 1 ? "s" : ""} ·{" "}
            {videoCount} video{videoCount !== 1 ? "s" : ""} ·{" "}
            {visibleCount} visible
          </p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors shadow-sm">
          <Plus size={16} /> Upload File
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-800">
        <Images size={16} className="flex-shrink-0 mt-0.5 text-[#0057D9]" />
        <p>
          Files are stored in Supabase Storage and served via a public CDN URL.
          Toggle <strong>Shown / Hidden</strong> to control what appears on the public gallery without deleting files.
          Hover a video thumbnail to preview it.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={14} /> Filter:
        </div>
        {/* Category filter */}
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#0057D9] bg-white">
          <option value="All">All Categories</option>
          {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Type filter */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#0057D9] bg-white">
          <option value="All">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        {(filterCat !== "All" || filterType !== "All") && (
          <button onClick={() => { setFilterCat("All"); setFilterType("All"); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline">Clear filters</button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24"><LoadingSpinner /></div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <EmptyState
            icon={Images}
            title={items.length === 0 ? "No gallery items yet" : "No items match your filters"}
            description={items.length === 0
              ? "Upload your first image or video to display it on the public gallery."
              : "Try changing or clearing the filters above."}
          />
          {items.length === 0 && (
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057D9] text-white text-sm font-semibold hover:bg-[#003DA0] transition-colors">
              <Upload size={15} /> Upload File
            </button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {displayed.map((item) => (
              <GalleryCard key={item.id} item={item}
                onEdit={openEdit} onDelete={setDeleteTarget} onToggleVisible={toggleVisible} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upload / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <GalleryModal
            editTarget={editTarget}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
            error={modalError}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            item={deleteTarget}
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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold
              ${toast.ok ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}
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
