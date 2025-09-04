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
    };
    Enums: {
      donation_status: 'pending' | 'completed' | 'failed';
      // Add other enums as needed
    };
  };
}
