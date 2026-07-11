import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/types/contact";
import type { ContactApiResponse } from "@/types/contact";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  sendConfirmationEmail,
  sendNotificationEmail,
} from "@/lib/email";

// ── Rate limit (simple in-memory, resets on cold start) ──────────
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX       = 5;
const rateLimitMap          = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now    = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) return true;

  record.count++;
  return false;
}

// ── POST /api/contact ────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse<ContactApiResponse>> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // 1. Rate limit
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  // 3. Server-side validation with Zod
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Validation failed.";
    return NextResponse.json(
      { success: false, message: firstError },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 4. Insert into Supabase using service role (bypasses RLS for server writes)
  const supabase = createServerSupabaseClient();

  const { data: inserted, error: dbError } = await supabase
    .from("contacts")
    .insert({
      name:       data.name,
      email:      data.email,
      phone:      data.phone ?? null,
      subject:    data.subject,
      message:    data.message,
      status:     "new",
    })
    .select("id")
    .single();

  if (dbError || !inserted) {
    console.error("[contact/route] Supabase insert error:", dbError?.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save your message. Please try again.",
        ...(process.env.NODE_ENV !== "production" && { error: dbError?.message }),
      },
      { status: 500 }
    );
  }

  const recordId = inserted.id as string;

  // 5. Send emails — non-blocking, failures don't break submission
  const emailResults = await Promise.allSettled([
    sendConfirmationEmail(data),
    sendNotificationEmail(data, recordId),
  ]);

  emailResults.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `[contact/route] Email ${i === 0 ? "confirmation" : "notification"} failed:`,
        result.reason
      );
    }
  });

  return NextResponse.json(
    {
      success: true,
      message: "Your message has been sent. We'll get back to you within 24 hours.",
      id: recordId,
    },
    { status: 201 }
  );
}

// Block all other methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
