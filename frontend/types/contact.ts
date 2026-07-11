import { z } from "zod";

// ─────────────────────────────────────────────
//  Zod schema — used on both client and server
// ─────────────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.replace(/\D/g, "").length >= 7, {
      message: "Enter a valid phone number",
    }),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject is too long")
    .trim(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters")
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─────────────────────────────────────────────
//  API response shape
// ─────────────────────────────────────────────
export interface ContactApiResponse {
  success: boolean;
  message: string;
  id?: string;       // UUID of the saved record
  error?: string;    // developer-facing, only in non-prod
}

// ─────────────────────────────────────────────
//  DB row shape  (mirrors Supabase contacts table)
// ─────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  ip_address: string | null;
  user_agent: string | null;
}

export type ContactInsert = Omit<ContactMessage, "id" | "created_at" | "status"> & {
  status?: "new";
};

// ─────────────────────────────────────────────
//  Subject suggestions (shared constant)
// ─────────────────────────────────────────────
export const SUBJECT_SUGGESTIONS = [
  "Advertising Package Inquiry",
  "Pricing Information",
  "Billboard Availability",
  "Partnership Opportunity",
  "General Question",
] as const;
