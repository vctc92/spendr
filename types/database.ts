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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          household_id: string
          id: string
          last4: string | null
          name: string
          opening_balance_minor: number
          owner_id: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
          visibility: Database["public"]["Enums"]["account_visibility"]
        }
        Insert: {
          created_at?: string
          household_id: string
          id?: string
          last4?: string | null
          name: string
          opening_balance_minor?: number
          owner_id: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["account_visibility"]
        }
        Update: {
          created_at?: string
          household_id?: string
          id?: string
          last4?: string | null
          name?: string
          opening_balance_minor?: number
          owner_id?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["account_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "accounts_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          default_need_level: Database["public"]["Enums"]["need_level"] | null
          household_id: string
          icon: string | null
          id: string
          kind: Database["public"]["Enums"]["category_kind"]
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_need_level?: Database["public"]["Enums"]["need_level"] | null
          household_id: string
          icon?: string | null
          id?: string
          kind: Database["public"]["Enums"]["category_kind"]
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_need_level?: Database["public"]["Enums"]["need_level"] | null
          household_id?: string
          icon?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["category_kind"]
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          base_currency: string
          created_at: string
          created_by: string
          id: string
          name: string
          time_zone: string
          updated_at: string
        }
        Insert: {
          base_currency: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          time_zone?: string
          updated_at?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          time_zone?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          created_at: string
          display_name: string
          household_id: string
          locale: string
          role: Database["public"]["Enums"]["member_role"]
          time_zone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          household_id: string
          locale?: string
          role: Database["public"]["Enums"]["member_role"]
          time_zone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          household_id?: string
          locale?: string
          role?: Database["public"]["Enums"]["member_role"]
          time_zone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_views: {
        Row: {
          created_at: string
          filter: Json
          household_id: string
          id: string
          name: string
          pinned: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filter?: Json
          household_id: string
          id?: string
          name: string
          pinned?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filter?: Json
          household_id?: string
          id?: string
          name?: string
          pinned?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_views_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount_minor: number
          category_id: string | null
          created_at: string
          created_by: string
          household_id: string
          id: string
          need_level: Database["public"]["Enums"]["need_level"] | null
          note: string | null
          tags: string[]
          to_account_id: string | null
          txn_time: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          account_id: string
          amount_minor: number
          category_id?: string | null
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          need_level?: Database["public"]["Enums"]["need_level"] | null
          note?: string | null
          tags?: string[]
          to_account_id?: string | null
          txn_time?: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount_minor?: number
          category_id?: string | null
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          need_level?: Database["public"]["Enums"]["need_level"] | null
          note?: string | null
          tags?: string[]
          to_account_id?: string | null
          txn_time?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_to_account_id_fkey"
            columns: ["to_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_household: {
        Args: {
          p_base_currency: string
          p_display_name: string
          p_locale?: string
          p_name: string
          p_time_zone?: string
        }
        Returns: string
      }
    }
    Enums: {
      account_type: "bank" | "credit_card" | "cash" | "wallet" | "loan"
      account_visibility: "shared" | "private"
      category_kind: "expense" | "income"
      member_role: "owner" | "member" | "viewer"
      need_level: "must_have" | "necessary" | "nice_to_have" | "avoidable"
      transaction_type: "expense" | "income" | "transfer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_type: ["bank", "credit_card", "cash", "wallet", "loan"],
      account_visibility: ["shared", "private"],
      category_kind: ["expense", "income"],
      member_role: ["owner", "member", "viewer"],
      need_level: ["must_have", "necessary", "nice_to_have", "avoidable"],
      transaction_type: ["expense", "income", "transfer"],
    },
  },
} as const
