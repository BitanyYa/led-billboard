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

export type ContactStatus = "new" | "read" | "replied";

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

export const CONTACT_STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string }> = {
  new:     { label: "New",     color: "#0057D9", bg: "#EFF6FF" },
  read:    { label: "Read",    color: "#7C3AED", bg: "#F5F3FF" },
  replied: { label: "Replied", color: "#059669", bg: "#ECFDF5" },
};
