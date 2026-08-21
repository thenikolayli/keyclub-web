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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          address: string | null
          attendance_url: string | null
          created_at: string
          date: string | null
          description: string | null
          end_time: string | null
          id: string
          n_of_slots: number | null
          n_of_volunteers: number | null
          name: string
          start_time: string | null
        }
        Insert: {
          address?: string | null
          attendance_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          n_of_slots?: number | null
          n_of_volunteers?: number | null
          name: string
          start_time?: string | null
        }
        Update: {
          address?: string | null
          attendance_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          n_of_slots?: number | null
          n_of_volunteers?: number | null
          name?: string
          start_time?: string | null
        }
        Relationships: []
      }
      member_tokens: {
        Row: {
          created_at: string
          id: string
          member_id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id?: string
          token: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_tokens_user_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          all_hours: number | null
          class: string
          created_at: string
          grad_year: number
          id: string
          name: string
          paid_dues: boolean | null
          personal_email: string | null
          phone_number: string | null
          school_email: string | null
          shirt_size: string | null
          strikes: number | null
          term_hours: number | null
          updated_at: string | null
        }
        Insert: {
          all_hours?: number | null
          class: string
          created_at?: string
          grad_year: number
          id?: string
          name: string
          paid_dues?: boolean | null
          personal_email?: string | null
          phone_number?: string | null
          school_email?: string | null
          shirt_size?: string | null
          strikes?: number | null
          term_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          all_hours?: number | null
          class?: string
          created_at?: string
          grad_year?: number
          id?: string
          name?: string
          paid_dues?: boolean | null
          personal_email?: string | null
          phone_number?: string | null
          school_email?: string | null
          shirt_size?: string | null
          strikes?: number | null
          term_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pending_invites: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role: Database["public"]["Enums"]["role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          role: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Relationships: []
      }
      spreadsheet_events: {
        Row: {
          address: string | null
          created_at: string
          date: string | null
          end_time: string | null
          id: string
          leaders: string[] | null
          made_by: string | null
          n_slots: number | null
          n_volunteers: number | null
          name: string | null
          start_time: string | null
          total_hours: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date?: string | null
          end_time?: string | null
          id?: string
          leaders?: string[] | null
          made_by?: string | null
          n_slots?: number | null
          n_volunteers?: number | null
          name?: string | null
          start_time?: string | null
          total_hours?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date?: string | null
          end_time?: string | null
          id?: string
          leaders?: string[] | null
          made_by?: string | null
          n_slots?: number | null
          n_volunteers?: number | null
          name?: string | null
          start_time?: string | null
          total_hours?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_all_tokens: {
        Args: { tokens: string[] }
        Returns: {
          member_id: string
        }[]
      }
    }
    Enums: {
      role: "member" | "leader" | "officer"
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
      role: ["member", "leader", "officer"],
    },
  },
} as const
