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
          phone: string;
          company: string | null;
          message: string;
          status: "new" | "read" | "replied";
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          company?: string | null;
          message: string;
          status?: "new" | "read" | "replied";
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          message?: string;
          status?: "new" | "read" | "replied";
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
