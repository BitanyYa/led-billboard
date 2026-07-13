import { z } from "zod";

// ─────────────────────────────────────────────
//  STEP 1 — Contact Information
// ─────────────────────────────────────────────
export const step1Schema = z.object({
  fullName:              z.string().min(2, "Full name must be at least 2 characters"),
  companyName:           z.string().optional(),
  email:                 z.string().email("Enter a valid email address"),
  phone:                 z.string().min(7, "Enter a valid phone number"),
  preferredContactMethod: z.enum(["phone", "email", "whatsapp"], {
    message: "Select a preferred contact method",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;

// ─────────────────────────────────────────────
//  STEP 2 — Campaign Details
// ─────────────────────────────────────────────
export const PACKAGES = [
  { value: "1_week",   label: "1 Week",   price: "ETB 47,036",  displays: "280" },
  { value: "1_month",  label: "1 Month",  price: "ETB 108,460", displays: "1,200" },
  { value: "3_months", label: "3 Months", price: "ETB 291,500", displays: "3,600" },
  { value: "6_months", label: "6 Months", price: "ETB 379,500", displays: "7,200" },
  { value: "1_year",   label: "1 Year",   price: "ETB 726,000", displays: "14,600" },
] as const;

export const BUSINESS_CATEGORIES = [
  "Retail", "Restaurant", "Hotel", "Electronics",
  "Healthcare", "Education", "Real Estate",
  "Government", "NGO", "Other",
] as const;

export const CAMPAIGN_OBJECTIVES = [
  "Brand Awareness", "Product Promotion", "Event Promotion",
  "Grand Opening", "Seasonal Promotion", "Other",
] as const;

export const step2Schema = z.object({
  package: z.enum(
    ["1_week", "1_month", "3_months", "6_months", "1_year"],
    { message: "Please select an advertising package" }
  ),
  businessCategory: z.enum(
    ["Retail","Restaurant","Hotel","Electronics","Healthcare",
     "Education","Real Estate","Government","NGO","Other"],
    { message: "Please select your business category" }
  ),
  campaignObjective: z.enum(
    ["Brand Awareness","Product Promotion","Event Promotion",
     "Grand Opening","Seasonal Promotion","Other"],
    { message: "Please select a campaign objective" }
  ),
});

export type Step2Data = z.infer<typeof step2Schema>;

// ─────────────────────────────────────────────
//  STEP 3 — Advertisement Upload
// ─────────────────────────────────────────────
export const ACCEPTED_MIME_TYPES = ["video/mp4", "image/jpeg", "image/jpg", "image/png"];
export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export const step3Schema = z
  .object({
    sendLater: z.boolean().default(false),
    adFile:    z.instanceof(File).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.sendLater) {
      if (!data.adFile) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["adFile"],
          message: "Please upload your advertisement file, or check 'I will send it later'",
        });
        return;
      }
      if (!ACCEPTED_MIME_TYPES.includes(data.adFile.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["adFile"],
          message: "Only MP4, JPG, JPEG, or PNG files are accepted",
        });
      }
      if (data.adFile.size > MAX_FILE_SIZE_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["adFile"],
          message: "File size must be under 500 MB",
        });
      }
    }
  });

export type Step3Data = z.infer<typeof step3Schema>;

// ─────────────────────────────────────────────
//  STEP 4 — Additional Information
// ─────────────────────────────────────────────
export const step4Schema = z.object({
  preferredStartDate:   z.string().optional(),
  specialInstructions:  z.string().max(500, "Max 500 characters").optional(),
});

export type Step4Data = z.infer<typeof step4Schema>;

// ─────────────────────────────────────────────
//  FULL FORM DATA
// ─────────────────────────────────────────────
export interface QuoteFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

// ─────────────────────────────────────────────
//  SUBMISSION PAYLOAD  (what we send to Supabase)
// ─────────────────────────────────────────────
export interface QuoteSubmissionPayload {
  // Contact
  full_name:               string;
  company_name:            string | null;
  email:                   string;
  phone:                   string;
  preferred_contact_method: "phone" | "email" | "whatsapp";
  // Campaign
  package:                 "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
  business_category:       string;
  campaign_objective:      string;
  // Ad
  send_later:              boolean;
  ad_file_url:             string | null;
  ad_file_name:            string | null;
  // Additional
  preferred_start_date:    string | null;
  special_instructions:    string | null;
  // Meta
  reference_number:        string;
  status:                  "pending";
}

// ─────────────────────────────────────────────
//  SUBMISSION RESULT
// ─────────────────────────────────────────────
export interface QuoteSubmissionResult {
  success:         boolean;
  referenceNumber: string;
  error?:          string;
}

// ─────────────────────────────────────────────
//  STEP META (used by progress bar + orchestrator)
// ─────────────────────────────────────────────
export interface StepMeta {
  number:      number;
  title:       string;
  description: string;
}

export const STEPS: StepMeta[] = [
  { number: 1, title: "Contact Info",    description: "Your contact details"         },
  { number: 2, title: "Campaign",        description: "Package & campaign goals"      },
  { number: 3, title: "Upload Ad",       description: "Your advertisement file"       },
  { number: 4, title: "Additional Info", description: "Start date & instructions"    },
  { number: 5, title: "Review",          description: "Confirm & submit"              },
];
