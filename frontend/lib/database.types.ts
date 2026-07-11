export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
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
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          subject: string;
          message: string;
          status?: "new" | "read" | "replied";
          ip_address?: string | null;
          user_agent?: string | null;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          subject?: string;
          message?: string;
          status?: "new" | "read" | "replied";
          ip_address?: string | null;
          user_agent?: string | null;
          admin_notes?: string | null;
        };
      };
      quotes: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          company: string | null;
          package: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
          start_date: string | null;
          notes: string | null;
          status: "new" | "contacted" | "confirmed" | "rejected";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          company?: string | null;
          package: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
          start_date?: string | null;
          notes?: string | null;
          status?: "new" | "contacted" | "confirmed" | "rejected";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          package?: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
          start_date?: string | null;
          notes?: string | null;
          status?: "new" | "contacted" | "confirmed" | "rejected";
        };
      };
      quote_requests: {
        Row: {
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
          status: "new" | "contacted" | "confirmed" | "rejected";
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          full_name: string;
          company_name?: string | null;
          email: string;
          phone: string;
          preferred_contact_method: "phone" | "email" | "whatsapp";
          package: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
          business_category: string;
          campaign_objective: string;
          send_later?: boolean;
          ad_file_url?: string | null;
          ad_file_name?: string | null;
          preferred_start_date?: string | null;
          special_instructions?: string | null;
          reference_number: string;
          status?: "new" | "contacted" | "confirmed" | "rejected";
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          full_name?: string;
          company_name?: string | null;
          email?: string;
          phone?: string;
          preferred_contact_method?: "phone" | "email" | "whatsapp";
          package?: "1_week" | "1_month" | "3_months" | "6_months" | "1_year";
          business_category?: string;
          campaign_objective?: string;
          send_later?: boolean;
          ad_file_url?: string | null;
          ad_file_name?: string | null;
          preferred_start_date?: string | null;
          special_instructions?: string | null;
          reference_number?: string;
          status?: "new" | "contacted" | "confirmed" | "rejected";
          admin_notes?: string | null;
        };
      };
      settings: {
        Row: {
          key: string;
          value: string;
          label: string;
          group_name: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          label: string;
          group_name?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          label?: string;
          group_name?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
