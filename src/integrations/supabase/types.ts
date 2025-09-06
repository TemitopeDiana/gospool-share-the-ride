export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          permission_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          permission_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          permission_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean | null
          last_login: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      board_advisors: {
        Row: {
          bio: string | null
          church_denomination: string | null
          company: string | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          church_denomination?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          church_denomination?: string | null
          company?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          contact_person: string | null
          created_at: string | null
          currency: string | null
          donor_email: string | null
          donor_name: string | null
          donor_phone: string | null
          donor_type: string | null
          id: string
          is_anonymous: boolean | null
          message: string | null
          organization_name: string | null
          organization_type: string | null
          show_publicly: boolean | null
          status: Database["public"]["Enums"]["donation_status"] | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          contact_person?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          donor_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          organization_name?: string | null
          organization_type?: string | null
          show_publicly?: boolean | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          contact_person?: string | null
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          donor_type?: string | null
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          organization_name?: string | null
          organization_type?: string | null
          show_publicly?: boolean | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      impact_partners: {
        Row: {
          company_name: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          updated_at: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      impact_reports_requests: {
        Row: {
          created_at: string | null
          id: string
          organization: string | null
          purpose: string | null
          report_type: string | null
          requester_email: string
          requester_name: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization?: string | null
          purpose?: string | null
          report_type?: string | null
          requester_email: string
          requester_name?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization?: string | null
          purpose?: string | null
          report_type?: string | null
          requester_email?: string
          requester_name?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: []
      }
      impact_sponsors: {
        Row: {
          application_id: string | null
          contribution_amount: number | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          motivation: string | null
          order_index: number | null
          sponsor_name: string
          sponsor_type: string
          start_date: string | null
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          application_id?: string | null
          contribution_amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          motivation?: string | null
          order_index?: number | null
          sponsor_name: string
          sponsor_type: string
          start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          application_id?: string | null
          contribution_amount?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          motivation?: string | null
          order_index?: number | null
          sponsor_name?: string
          sponsor_type?: string
          start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_sponsors_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "sponsorship_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_name: string | null
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      paystack_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donation_id: string | null
          id: string
          last_verification_at: string | null
          paystack_response: Json | null
          reference: string
          status: string
          updated_at: string
          verification_attempts: number | null
          webhook_payload: Json | null
          webhook_received_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donation_id?: string | null
          id?: string
          last_verification_at?: string | null
          paystack_response?: Json | null
          reference: string
          status?: string
          updated_at?: string
          verification_attempts?: number | null
          webhook_payload?: Json | null
          webhook_received_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donation_id?: string | null
          id?: string
          last_verification_at?: string | null
          paystack_response?: Json | null
          reference?: string
          status?: string
          updated_at?: string
          verification_attempts?: number | null
          webhook_payload?: Json | null
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paystack_transactions_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_changes: {
        Row: {
          action_type: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: string | null
          table_name: string
        }
        Insert: {
          action_type: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string | null
          table_name: string
        }
        Update: {
          action_type?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string | null
          table_name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          location: string | null
          progress_percentage: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      sponsorship_applications: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string
          id: string
          motivation: string | null
          organization_name: string | null
          phone: string | null
          profile_picture_url: string | null
          sponsor_amount: number | null
          sponsor_duration: string | null
          sponsor_type: string
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email: string
          id?: string
          motivation?: string | null
          organization_name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          sponsor_amount?: number | null
          sponsor_duration?: string | null
          sponsor_type: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string
          id?: string
          motivation?: string | null
          organization_name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          sponsor_amount?: number | null
          sponsor_duration?: string | null
          sponsor_type?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          church_denomination: string | null
          created_at: string | null
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          role: string
          team_role: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          church_denomination?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          role: string
          team_role?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          church_denomination?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          role?: string
          team_role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_applications: {
        Row: {
          applicant_name: string
          applied_date: string
          email: string
          id: string
          phone: string | null
          preferred_areas: string | null
          resume_url: string | null
          status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          applicant_name: string
          applied_date?: string
          email: string
          id?: string
          phone?: string | null
          preferred_areas?: string | null
          resume_url?: string | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          applicant_name?: string
          applied_date?: string
          email?: string
          id?: string
          phone?: string | null
          preferred_areas?: string | null
          resume_url?: string | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      analytics_summary: {
        Row: {
          date: string | null
          donations_completed: number | null
          donations_initiated: number | null
          page_views: number | null
          returning_visitors: number | null
          sponsor_applications: number | null
          total_events: number | null
          unique_sessions: number | null
          unique_visitors: number | null
          volunteer_applications: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_pending_change: {
        Args: { change_id: string }
        Returns: undefined
      }
      assign_super_admin: {
        Args: { user_email: string }
        Returns: string
      }
      create_pending_change: {
        Args: {
          p_action_type: string
          p_new_data?: Json
          p_old_data?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      get_cron_jobs: {
        Args: Record<PropertyKey, never>
        Returns: {
          active: boolean
          command: string
          database: string
          jobid: number
          nodename: string
          nodeport: number
          schedule: string
          username: string
        }[]
      }
      get_donation_conversion_rate: {
        Args: { end_date?: string; start_date?: string }
        Returns: {
          completed_count: number
          conversion_rate: number
          initiated_count: number
        }[]
      }
      get_donation_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_amount: number
          currency: string
          total_amount: number
          total_count: number
        }[]
      }
      get_pending_changes: {
        Args: Record<PropertyKey, never>
        Returns: {
          action_type: string
          created_at: string
          created_by: string
          created_by_profile: Json
          id: string
          new_data: Json
          old_data: Json
          record_id: string
          status: string
          table_name: string
        }[]
      }
      get_recent_donations_public: {
        Args: { limit_count?: number }
        Returns: {
          amount: number
          created_at: string
          currency: string
          donor_type: string
          is_anonymous: boolean
        }[]
      }
      has_permission: {
        Args: { _action: string; _permission_type: string; _user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      reject_pending_change: {
        Args: { change_id: string; reason?: string }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "admin" | "user" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "approved", "rejected"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["admin", "user", "super_admin"],
    },
  },
} as const
