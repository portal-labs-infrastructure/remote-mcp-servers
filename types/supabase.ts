export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      benchmark_runs: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string
          declared_capabilities: Json | null
          id: string
          results: Json | null
          score: number | null
          status: Database["public"]["Enums"]["benchmark_status"]
          success: boolean | null
          time_to_completion_ms: number | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          declared_capabilities?: Json | null
          id?: string
          results?: Json | null
          score?: number | null
          status?: Database["public"]["Enums"]["benchmark_status"]
          success?: boolean | null
          time_to_completion_ms?: number | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          declared_capabilities?: Json | null
          id?: string
          results?: Json | null
          score?: number | null
          status?: Database["public"]["Enums"]["benchmark_status"]
          success?: boolean | null
          time_to_completion_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_runs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark_sessions: {
        Row: {
          created_at: string
          current_step: string | null
          id: string
          run_id: string | null
          session_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: string | null
          id: string
          run_id?: string | null
          session_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string | null
          id?: string
          run_id?: string | null
          session_data?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_sessions_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "benchmark_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_info: Json
          created_at: string
          id: string
        }
        Insert: {
          client_info: Json
          created_at?: string
          id?: string
        }
        Update: {
          client_info?: Json
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      discoverable_mcp_servers: {
        Row: {
          ai_summary: string | null
          authentication_type: string
          average_rating: number | null
          category: string
          created_at: string | null
          description: string
          documentation_url: string | null
          dynamic_client_registration: boolean | null
          icon_url: string | null
          id: string
          is_official: boolean | null
          maintainer_name: string
          maintainer_url: string
          mcp_url: string
          name: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          authentication_type: string
          average_rating?: number | null
          category: string
          created_at?: string | null
          description: string
          documentation_url?: string | null
          dynamic_client_registration?: boolean | null
          icon_url?: string | null
          id?: string
          is_official?: boolean | null
          maintainer_name: string
          maintainer_url: string
          mcp_url: string
          name: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          authentication_type?: string
          average_rating?: number | null
          category?: string
          created_at?: string | null
          description?: string
          documentation_url?: string | null
          dynamic_client_registration?: boolean | null
          icon_url?: string | null
          id?: string
          is_official?: boolean | null
          maintainer_name?: string
          maintainer_url?: string
          mcp_url?: string
          name?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discoverable_mcp_servers_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      server_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          server_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          server_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          server_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_reviews_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "discoverable_mcp_servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_reviews_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      unique_authentication_types: {
        Row: {
          authentication_type: string | null
        }
        Relationships: []
      }
      unique_categories: {
        Row: {
          category: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      append_to_log: {
        Args: { run_id_param: string; log_entry: Json }
        Returns: undefined
      }
      cleanup_zombie_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_client_details: {
        Args: { client_id_in: string }
        Returns: {
          client_id: string
          client_name: string
          client_version: string
          highest_score: number
          success_rate: number
          total_runs: number
        }[]
      }
      get_client_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          client_name: string
          client_version: string
          highest_score: number
          fastest_time_ms: number
          total_runs: number
          last_run_at: string
        }[]
      }
    }
    Enums: {
      benchmark_status: "in_progress" | "completed" | "failed"
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
      benchmark_status: ["in_progress", "completed", "failed"],
    },
  },
} as const
