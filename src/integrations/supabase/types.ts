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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          capabilities: string[] | null
          created_at: string
          customers: string[] | null
          delivery_geo: string[] | null
          description: string | null
          founded: number | null
          hq: string | null
          id: string
          investors: string[] | null
          logo: string | null
          ma_score: number | null
          ma_scores: Json | null
          management: Json | null
          name: string
          partners: string[] | null
          people: number | null
          revenue: string | null
          revenue_geo: string[] | null
          skills: string[] | null
          social_links: Json | null
          status: string
          updated_at: string
          verticals: string[] | null
          website: string | null
        }
        Insert: {
          capabilities?: string[] | null
          created_at?: string
          customers?: string[] | null
          delivery_geo?: string[] | null
          description?: string | null
          founded?: number | null
          hq?: string | null
          id?: string
          investors?: string[] | null
          logo?: string | null
          ma_score?: number | null
          ma_scores?: Json | null
          management?: Json | null
          name: string
          partners?: string[] | null
          people?: number | null
          revenue?: string | null
          revenue_geo?: string[] | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string
          updated_at?: string
          verticals?: string[] | null
          website?: string | null
        }
        Update: {
          capabilities?: string[] | null
          created_at?: string
          customers?: string[] | null
          delivery_geo?: string[] | null
          description?: string | null
          founded?: number | null
          hq?: string | null
          id?: string
          investors?: string[] | null
          logo?: string | null
          ma_score?: number | null
          ma_scores?: Json | null
          management?: Json | null
          name?: string
          partners?: string[] | null
          people?: number | null
          revenue?: string | null
          revenue_geo?: string[] | null
          skills?: string[] | null
          social_links?: Json | null
          status?: string
          updated_at?: string
          verticals?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      mandate_activities: {
        Row: {
          actor_name: string | null
          created_at: string
          description: string
          id: string
          mandate_id: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          actor_name?: string | null
          created_at?: string
          description: string
          id?: string
          mandate_id: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          actor_name?: string | null
          created_at?: string
          description?: string
          id?: string
          mandate_id?: string
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mandate_activities_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "mandates"
            referencedColumns: ["id"]
          },
        ]
      }
      mandates: {
        Row: {
          capabilities: string[] | null
          created_at: string
          delivery_geo: string[] | null
          description: string | null
          est_revenue: string | null
          go_to_market: string | null
          hq: string | null
          id: string
          matching_companies: number | null
          partners: string[] | null
          people_scale: string | null
          revenue_geo: string[] | null
          strategy: string | null
          title: string
          updated_at: string
          user_id: string
          verticals: string[] | null
        }
        Insert: {
          capabilities?: string[] | null
          created_at?: string
          delivery_geo?: string[] | null
          description?: string | null
          est_revenue?: string | null
          go_to_market?: string | null
          hq?: string | null
          id?: string
          matching_companies?: number | null
          partners?: string[] | null
          people_scale?: string | null
          revenue_geo?: string[] | null
          strategy?: string | null
          title: string
          updated_at?: string
          user_id: string
          verticals?: string[] | null
        }
        Update: {
          capabilities?: string[] | null
          created_at?: string
          delivery_geo?: string[] | null
          description?: string | null
          est_revenue?: string | null
          go_to_market?: string | null
          hq?: string | null
          id?: string
          matching_companies?: number | null
          partners?: string[] | null
          people_scale?: string | null
          revenue_geo?: string[] | null
          strategy?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          verticals?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
