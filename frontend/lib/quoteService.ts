import { supabase } from "./supabase";
import type {
  QuoteFormData,
  QuoteSubmissionPayload,
  QuoteSubmissionResult,
} from "@/types/quote";

// ─────────────────────────────────────────────
//  Generate reference number  e.g. AWLO-2A9F3B
// ─────────────────────────────────────────────
export function generateReferenceNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AWLO-${result}`;
}

// ─────────────────────────────────────────────
//  Upload ad file to Supabase Storage
//  (no-op / returns null when Supabase is not yet configured)
// ─────────────────────────────────────────────
async function uploadAdFile(
  file: File,
  referenceNumber: string
): Promise<string | null> {
  try {
    const ext = file.name.split(".").pop();
    const path = `ads/${referenceNumber}.${ext}`;

    const { error } = await supabase.storage
      .from("advertisements")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (error) {
      console.warn("Storage upload skipped (bucket may not exist yet):", error.message);
      return null;
    }

    const { data } = supabase.storage.from("advertisements").getPublicUrl(path);
    return data.publicUrl ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
//  Build flat payload from nested form data
// ─────────────────────────────────────────────
function buildPayload(
  form: QuoteFormData,
  referenceNumber: string,
  adFileUrl: string | null
): QuoteSubmissionPayload {
  return {
    // Contact
    full_name:                form.step1.fullName,
    company_name:             form.step1.companyName || null,
    email:                    form.step1.email,
    phone:                    form.step1.phone,
    preferred_contact_method: form.step1.preferredContactMethod,
    // Campaign
    package:                  form.step2.package,
    business_category:        form.step2.businessCategory,
    campaign_objective:       form.step2.campaignObjective,
    // Ad
    send_later:               form.step3.sendLater,
    ad_file_url:              adFileUrl,
    ad_file_name:             form.step3.adFile?.name ?? null,
    // Additional
    preferred_start_date:     form.step4.preferredStartDate || null,
    special_instructions:     form.step4.specialInstructions || null,
    // Meta
    reference_number:         referenceNumber,
    status:                   "pending",
  };
}

// ─────────────────────────────────────────────
//  Main submit function
// ─────────────────────────────────────────────
export async function submitQuoteRequest(
  form: QuoteFormData
): Promise<QuoteSubmissionResult> {
  const referenceNumber = generateReferenceNumber();

  try {
    // 1. Upload file if provided
    let adFileUrl: string | null = null;
    if (!form.step3.sendLater && form.step3.adFile) {
      adFileUrl = await uploadAdFile(form.step3.adFile, referenceNumber);
    }

    // 2. Build flat payload
    const payload = buildPayload(form, referenceNumber, adFileUrl);

    // 3. Insert into Supabase
    const { error } = await supabase.from("quote_requests").insert(payload);

    if (error) {
      // If table doesn't exist yet, fall back to mock success so dev can
      // continue testing the UI without running the migration first.
      if (
        error.message.includes("relation") &&
        error.message.includes("does not exist")
      ) {
        console.warn(
          "quote_requests table not found — using mock success. Run the SQL migration to persist data."
        );
        return { success: true, referenceNumber };
      }
      throw new Error(error.message);
    }

    // 4. Send email notification asynchronously
    fetch("/api/quote-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(err => {
      console.error("Failed to trigger quote email:", err);
    });

    return { success: true, referenceNumber };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Quote submission error:", message);
    return { success: false, referenceNumber, error: message };
  }
}
