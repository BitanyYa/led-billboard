// ─────────────────────────────────────────────
//  Quote Request row (matches DB + migration 006)
// ─────────────────────────────────────────────
export interface QuoteRequest {
  id: string;
  created_at: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  preferred_contact_method: "phone" | "email" | "whatsapp";
  package: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
  business_category: string;
  campaign_objective: string;
  send_later: boolean;
  ad_file_url: string | null;
  ad_file_name: string | null;
  preferred_start_date: string | null;
  special_instructions: string | null;
  reference_number: string;
  status: QuoteStatus;
  admin_notes: string | null;
}

export type QuoteStatus =
  | "pending"
  | "under_review"
  | "waiting_customer"
  | "waiting_payment"
  | "approved"
  | "rejected";

export interface QuoteTimeline {
  id: string;
  quote_id: string;
  status: QuoteStatus;
  note: string | null;
  created_at: string;
  created_by: string | null;
}

// ─────────────────────────────────────────────
//  Contact message row (matches DB + migrations 003–005)
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
  status: ContactStatus;
  ip_address: string | null;
  user_agent: string | null;
  admin_notes: string | null;
}

export type ContactStatus = "new" | "read" | "replied" | "archived";

// ─────────────────────────────────────────────
//  Settings row
// ─────────────────────────────────────────────
export interface Setting {
  key: string;
  value: string;
  label: string;
  group_name: string;
  updated_at: string;
}

export type SettingsMap = Record<string, string>;

// ─────────────────────────────────────────────
//  Dashboard stats
// ─────────────────────────────────────────────
export interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalContacts: number;
  newToday: number;
  // kept for backwards compat
  newQuotes: number;
  confirmedQuotes: number;
  newContacts: number;
  repliedContacts: number;
}

export interface MonthlyChartPoint {
  month: string;   // "Jan", "Feb" …
  quotes: number;
  contacts: number;
}

export interface StatusDistributionPoint {
  name: string;
  value: number;
  color: string;
}

// ─────────────────────────────────────────────
//  Shared filter/pagination types
// ─────────────────────────────────────────────
export interface TableFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export const PACKAGE_LABELS: Record<QuoteRequest["package"], string> = {
  "1_week":   "1 Week",
  "1_month":  "1 Month",
  "3_months": "3 Months",
  "6_months": "6 Months",
  "1_year":   "1 Year",
};

export const PACKAGE_PRICES: Record<QuoteRequest["package"], string> = {
  "1_week":   "ETB 47,036",
  "1_month":  "ETB 108,460",
  "3_months": "ETB 291,500",
  "6_months": "ETB 379,500",
  "1_year":   "ETB 726,000",
};

export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:          { label: "Pending",              color: "#6B7280", bg: "#F9FAFB", icon: "⏳" },
  under_review:     { label: "Under Review",         color: "#0057D9", bg: "#EFF6FF", icon: "🔍" },
  waiting_customer: { label: "Waiting for Customer", color: "#D97706", bg: "#FFFBEB", icon: "👤" },
  waiting_payment:  { label: "Waiting for Payment",  color: "#7C3AED", bg: "#F5F3FF", icon: "💳" },
  approved:         { label: "Approved",             color: "#059669", bg: "#ECFDF5", icon: "✅" },
  rejected:         { label: "Rejected",             color: "#DC2626", bg: "#FEF2F2", icon: "❌" },
};

export const CONTACT_STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string; icon: string }> = {
  new:      { label: "New",      color: "#0057D9", bg: "#EFF6FF", icon: "🔵" },
  read:     { label: "Read",     color: "#7C3AED", bg: "#F5F3FF", icon: "👁️" },
  replied:  { label: "Replied",  color: "#059669", bg: "#ECFDF5", icon: "✅" },
  archived: { label: "Archived", color: "#6B7280", bg: "#F9FAFB", icon: "📦" },
};

// ─────────────────────────────────────────────
//  Package
// ─────────────────────────────────────────────
export interface Package {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  price: number;
  duration: string;
  advertisement_length: number;  // seconds
  displays_per_day: number;
  featured: boolean;
  visible: boolean;
  sort_order: number;
}

export type PackageFormData = Omit<Package, "id" | "created_at" | "updated_at">;

// ─────────────────────────────────────────────
//  Gallery
// ─────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  category: string;
  file_url: string;
  storage_path: string;
  file_type: "image" | "video";
  file_name: string;
  file_size: number | null;
  visible: boolean;
  sort_order: number;
}

export type GalleryItemFormData = Pick<GalleryItem, "title" | "category" | "visible" | "sort_order">;

export const GALLERY_CATEGORIES = [
  "General",
  "Night View",
  "Day View",
  "Events",
  "Campaigns",
  "Behind the Scenes",
] as const;

// ─────────────────────────────────────────────
//  Internal Notes (shared by quotes + campaigns)
// ─────────────────────────────────────────────
export interface InternalNote {
  id: string;
  created_at: string;
  content: string;
  author: string;
  quote_request_id: string | null;
  campaign_id: string | null;
}

// ─────────────────────────────────────────────
//  Campaign
// ─────────────────────────────────────────────
export interface Campaign {
  id: string;
  created_at: string;
  campaign_number: string;
  reference_number: string;
  quote_request_id: string | null;
  customer_name: string;
  company: string | null;
  package: QuoteRequest["package"];
  business_category: string;
  campaign_objective: string;
  ad_file_url: string | null;
  ad_file_name: string | null;
  start_date: string | null;
  end_date: string | null;
  campaign_status: CampaignStatus;
  payment_status: PaymentStatus;
  assigned_operator: string | null;
  admin_notes: string | null;
  /** Number of times the ad plays per day (internal planning only) */
  display_frequency: number;
  /** Duration of each advertisement slot in seconds (internal planning only) */
  ad_duration: number;
  /** Internal scheduling notes visible to admin/operators only */
  scheduling_notes: string | null;
}

export type CampaignStatus =
  | "ready_for_scheduling"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "partially_paid"
  | "refunded";

export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string; icon: string }> = {
  ready_for_scheduling: { label: "Ready for Scheduling", color: "#0057D9", bg: "#EFF6FF",  icon: "📋" },
  scheduled:            { label: "Scheduled",            color: "#7C3AED", bg: "#F5F3FF",  icon: "🗓️" },
  running:              { label: "Running",              color: "#059669", bg: "#ECFDF5",  icon: "▶️" },
  paused:               { label: "Paused",               color: "#D97706", bg: "#FFFBEB",  icon: "⏸️" },
  completed:            { label: "Completed",            color: "#6B7280", bg: "#F9FAFB",  icon: "✅" },
  cancelled:            { label: "Cancelled",            color: "#DC2626", bg: "#FEF2F2",  icon: "❌" },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:       { label: "Pending",        color: "#D97706", bg: "#FFFBEB", icon: "⏳" },
  paid:          { label: "Paid",           color: "#059669", bg: "#ECFDF5", icon: "💚" },
  partially_paid:{ label: "Partially Paid", color: "#7C3AED", bg: "#F5F3FF", icon: "💜" },
  refunded:      { label: "Refunded",       color: "#DC2626", bg: "#FEF2F2", icon: "↩️" },
};
