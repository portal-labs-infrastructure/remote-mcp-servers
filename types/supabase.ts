export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      benchmark_runs: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          results: Json | null
          status: Database["public"]["Enums"]["benchmark_status"]
          success: boolean | null
          time_to_completion_ms: number | null
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
          status?: Database["public"]["Enums"]["benchmark_status"]
          success?: boolean | null
          time_to_completion_ms?: number | null
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
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
          run_id: string
          session_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: string | null
          id: string
          run_id: string
          session_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: string | null
          id?: string
          run_id?: string
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
      [_ in never]: never
    }
    Enums: {
      benchmark_status: "in_progress" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
