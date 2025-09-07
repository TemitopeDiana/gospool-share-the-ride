export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      donations: {
        Row: {
          id: string;
          donor_name: string | null;
          donor_email: string | null;
          donor_phone: string | null;
          donor_type: 'individual' | 'organization';
          organization_name: string | null;
          organization_type: string | null;
          contact_person: string | null;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          is_anonymous: boolean;
          show_publicly: boolean;
          created_at: string;
          updated_at: string | null;
          church_name: string | null;
          belongs_to_church: string | null;
        };
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['donations']['Row']>;
      };
      paystack_transactions: {
        Row: {
          id: string;
          donation_id: string;
          reference: string;
          status: string;
          verification_attempts: number;
          last_verification_at: string | null;
          webhook_received_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['paystack_transactions']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['paystack_transactions']['Row']>;
      };
      volunteer_applications: {
        Row: {
          id: string;
          applicant_name: string;
          email: string;
          phone: string | null;
          preferred_areas: string | null;
          applied_date: string;
          resume_url: string | null;
          status: string;
          verified_by: string | null;
          verified_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['volunteer_applications']['Row'], 'id' | 'applied_date'> & { id?: string; applied_date?: string };
        Update: Partial<Database['public']['Tables']['volunteer_applications']['Row']>;
      };
      sponsorship_applications: {
        Row: {
          id: string;
          user_id: string | null;
          sponsor_type: string;
          organization_name: string | null;
          contact_person: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          sponsor_amount: number | null;
          sponsor_duration: string | null;
          motivation: string | null;
          profile_picture_url: string | null;
          status: Database['public']['Enums']['application_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sponsorship_applications']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['sponsorship_applications']['Row']>;
      };
      impact_sponsors: {
        Row: {
          id: string;
          application_id: string | null;
          sponsor_name: string;
          sponsor_type: string;
          logo_url: string | null;
          website_url: string | null;
          contribution_amount: number | null;
          tier: string;
          motivation: string | null;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['impact_sponsors']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['impact_sponsors']['Row']>;
      };
      impact_partners: {
        Row: {
          id: string;
          company_name: string;
          logo_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['impact_partners']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['impact_partners']['Row']>;
      };
      impact_reports: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          report_period_start: string | null;
          report_period_end: string | null;
          metrics: Json;
          images: string[] | null;
          file_url: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['impact_reports']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['impact_reports']['Row']>;
      };
      impact_reports_requests: {
        Row: {
          id: string;
          requester_email: string;
          requester_name: string | null;
          organization: string | null;
          report_type: string | null;
          purpose: string | null;
          status: 'pending' | 'approved' | 'rejected';
          pitch_deck_file_url: string | null;
          approved_by: string | null;
          approved_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['impact_reports_requests']['Row'], 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['impact_reports_requests']['Row']>;
      };
    };
    Enums: {
      donation_status: 'pending' | 'completed' | 'failed';
      application_status: 'pending' | 'approved' | 'rejected';
      // Add other enums as needed
    };
  };
}
