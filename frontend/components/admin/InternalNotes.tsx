"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, AlertCircle, User, Clock } from "lucide-react";
import { getAdminClient } from "@/lib/supabase-admin";
import type { InternalNote } from "@/types/admin";

/* ── helpers ──────────────────────────────────────────────────────── */
function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return fmt(iso);
}

/* ── Avatar initials ──────────────────────────────────────────────── */
const AVATAR_COLORS = [
  ["#0057D9", "#EFF6FF"],
  ["#7C3AED", "#F5F3FF"],
  ["#059669", "#ECFDF5"],
  ["#D97706", "#FFFBEB"],
  ["#DC2626", "#FEF2F2"],
];

function avatarColor(author: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < author.length; i++) hash = author.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] as [string, string];
}

function Avatar({ author }: { author: string }) {
  const initials = author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [fg, bg] = avatarColor(author);
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 select-none"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials || <User size={13} style={{ color: fg }} />}
    </div>
  );
}

/* ── Delete confirmation inline ───────────────────────────────────── */
function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function arm() {
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 3000);
  }
  function confirm() {
    if (timer.current) clearTimeout(timer.current);
    setArmed(false);
    onConfirm();
  }

  return armed ? (
    <button
      onClick={confirm}
      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600
        bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition-colors"
    >
      <Trash2 size={11} /> Confirm delete
    </button>
  ) : (
    <button
      onClick={arm}
      className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
      title="Delete note"
    >
      <Trash2 size={13} />
    </button>
  );
}

/* ── Props ────────────────────────────────────────────────────────── */
interface InternalNotesProps {
  /** The DB id of the parent record */
  parentId: string;
  /** Which table this note belongs to */
  parentType: "quote_request" | "campaign";
  /** Accent colour used for the compose button and icons */
  accentColor?: string;
}

/* ── Main component ───────────────────────────────────────────────── */
export default function InternalNotes({
  parentId,
  parentType,
  accentColor = "#D97706",
}: InternalNotesProps) {
  const [notes,       setNotes]       = useState<InternalNote[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");

  /* compose form */
  const [content, setContent] = useState("");
  const [author,  setAuthor]  = useState(() => {
    if (typeof window === "undefined") return "Admin";
    return localStorage.getItem("awlo-note-author") ?? "Admin";
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef  = useRef<HTMLDivElement>(null);

  /* ── Load notes ── */
  useEffect(() => {
    async function load() {
      const db = getAdminClient();
      const col = parentType === "quote_request" ? "quote_request_id" : "campaign_id";
      const { data, error: err } = await db
        .from("internal_notes")
        .select("*")
        .eq(col, parentId)
        .order("created_at", { ascending: true });

      if (err) setError(err.message);
      else setNotes((data ?? []) as InternalNote[]);
      setLoading(false);
    }
    load();
  }, [parentId, parentType]);

  /* ── Auto-grow textarea ── */
  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  /* ── Persist author name ── */
  function handleAuthorChange(v: string) {
    setAuthor(v);
    if (typeof window !== "undefined") localStorage.setItem("awlo-note-author", v);
  }

  /* ── Submit new note ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError("");

    const db  = getAdminClient();
    const col = parentType === "quote_request" ? "quote_request_id" : "campaign_id";

    const payload = {
      content:  trimmed,
      author:   author.trim() || "Admin",
      [col]:    parentId,
    };

    const { data, error: err } = await db
      .from("internal_notes")
      .insert(payload)
      .select("*")
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setNotes((prev) => [...prev, data as InternalNote]);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      /* scroll to new note */
      setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    }

    setSubmitting(false);
  }

  /* ── Delete note ── */
  async function handleDelete(noteId: string) {
    /* optimistic remove */
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    const db = getAdminClient();
    const { error: err } = await db
      .from("internal_notes")
      .delete()
      .eq("id", noteId);

    if (err) {
      setError(err.message);
      /* revert: re-fetch */
      const col = parentType === "quote_request" ? "quote_request_id" : "campaign_id";
      const { data } = await db
        .from("internal_notes")
        .select("*")
        .eq(col, parentId)
        .order("created_at", { ascending: true });
      setNotes((data ?? []) as InternalNote[]);
    }
  }

  /* ── Render ── */
  return (
    <div className="space-y-4">

      {/* ── Note count header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} style={{ color: accentColor }} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {loading ? "Loading…" : notes.length === 0 ? "No notes yet" : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}
          </span>
        </div>
        <span className="text-xs text-gray-300 italic">Visible to admins only</span>
      </div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-600 text-xs bg-red-50 rounded-xl px-4 py-3 border border-red-100"
          >
            <AlertCircle size={13} className="flex-shrink-0" /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Note list ── */}
      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="group flex gap-3"
              >
                <Avatar author={note.author} />
                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-800 truncate">{note.author}</span>
                      <span className="text-gray-200">·</span>
                      <span
                        className="text-xs text-gray-400 flex-shrink-0"
                        title={fmt(note.created_at)}
                      >
                        <Clock size={10} className="inline mr-0.5 -mt-0.5" />
                        {relativeTime(note.created_at)}
                      </span>
                    </div>
                    {/* Delete — only visible on row hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <DeleteButton onConfirm={() => handleDelete(note.id)} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {note.content}
                  </div>

                  {/* Absolute timestamp below note */}
                  <div className="text-[11px] text-gray-300 mt-1 pl-0.5">{fmt(note.created_at)}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={listEndRef} />
        </div>
      )}

      {/* ── Compose form ── */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-gray-300
          focus-within:ring-2 transition-all"
        style={{ ["--tw-ring-color" as string]: accentColor + "20" }}
      >
        {/* Author row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-gray-100">
          <User size={12} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={author}
            onChange={(e) => handleAuthorChange(e.target.value)}
            placeholder="Your name"
            maxLength={60}
            className="flex-1 text-xs font-semibold text-gray-700 bg-transparent outline-none
              placeholder:text-gray-300 placeholder:font-normal"
          />
          <span className="text-[10px] text-gray-300 flex-shrink-0">Author</span>
        </div>

        {/* Note content */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); autoGrow(); }}
          onKeyDown={(e) => {
            /* Cmd/Ctrl+Enter submits */
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Write a note… (Ctrl+Enter to post)"
          rows={3}
          className="w-full px-4 py-3 text-sm text-gray-800 bg-white outline-none
            resize-none placeholder:text-gray-300 leading-relaxed"
          style={{ minHeight: "80px" }}
        />

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
          <span className="text-[11px] text-gray-300">
            {content.length > 0 ? `${content.length} chars` : ""}
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl
              text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed
              shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Posting…
              </>
            ) : (
              <>
                <Send size={12} /> Post Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
