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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          outlet_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          outlet_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          outlet_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          outlet_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          outlet_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          outlet_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      drop_redemptions: {
        Row: {
          drop_id: string
          id: string
          outlet_id: string | null
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          drop_id: string
          id?: string
          outlet_id?: string | null
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          drop_id?: string
          id?: string
          outlet_id?: string | null
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drop_redemptions_drop_id_fkey"
            columns: ["drop_id"]
            isOneToOne: false
            referencedRelation: "drops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drop_redemptions_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
      drops: {
        Row: {
          color: string | null
          created_at: string | null
          credits_required: number | null
          description: string | null
          emoji: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          credits_required?: number | null
          description?: string | null
          emoji?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          credits_required?: number | null
          description?: string | null
          emoji?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      outlets: {
        Row: {
          address: string
          city: string
          created_at: string | null
          id: string
          is_open: boolean | null
          latitude: number
          longitude: number
          name: string
          qr_code: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          latitude: number
          longitude: number
          name: string
          qr_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          qr_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          badges: string[] | null
          created_at: string | null
          credits: number | null
          current_streak: number | null
          id: string
          name: string
          phone: string | null
          tier: Database["public"]["Enums"]["user_tier"] | null
          total_visits: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges?: string[] | null
          created_at?: string | null
          credits?: number | null
          current_streak?: number | null
          id?: string
          name: string
          phone?: string | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          total_visits?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges?: string[] | null
          created_at?: string | null
          credits?: number | null
          current_streak?: number | null
          id?: string
          name?: string
          phone?: string | null
          tier?: Database["public"]["Enums"]["user_tier"] | null
          total_visits?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string | null
          credits_earned: number | null
          id: string
          outlet_id: string
          user_id: string
          user_latitude: number | null
          user_longitude: number | null
          verified_location: boolean | null
        }
        Insert: {
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          outlet_id: string
          user_id: string
          user_latitude?: number | null
          user_longitude?: number | null
          verified_location?: boolean | null
        }
        Update: {
          created_at?: string | null
          credits_earned?: number | null
          id?: string
          outlet_id?: string
          user_id?: string
          user_latitude?: number | null
          user_longitude?: number | null
          verified_location?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_outlet_id_fkey"
            columns: ["outlet_id"]
            isOneToOne: false
            referencedRelation: "outlets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_tier: "newcomer" | "regular" | "insider" | "legend"
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
      user_tier: ["newcomer", "regular", "insider", "legend"],
    },
  },
} as const
