import { NextRequest, NextResponse } from "next/server";
import { sendQuoteNotificationEmail } from "@/lib/email";
import type { QuoteSubmissionPayload } from "@/types/quote";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as QuoteSubmissionPayload;

    if (!payload || !payload.email || !payload.reference_number) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    await sendQuoteNotificationEmail(payload);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Failed to send quote notification email:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
