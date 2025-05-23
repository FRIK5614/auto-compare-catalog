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
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          content: string
          id: string
          is_read: boolean
          sender_id: string
          sender_name: string
          sender_type: string
          session_id: string
          timestamp: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          id?: string
          is_read?: boolean
          sender_id: string
          sender_name: string
          sender_type: string
          session_id: string
          timestamp?: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          id?: string
          is_read?: boolean
          sender_id?: string
          sender_name?: string
          sender_type?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          source: string | null
          status: string
          telegram_chat_id: string | null
          unread_count: number
          user_contact: string | null
          user_name: string
        }
        Insert: {
          created_at?: string
          id: string
          last_activity?: string
          source?: string | null
          status?: string
          telegram_chat_id?: string | null
          unread_count?: number
          user_contact?: string | null
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          source?: string | null
          status?: string
          telegram_chat_id?: string | null
          unread_count?: number
          user_contact?: string | null
          user_name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          car_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          admin_id: string | null
          content: string
          created_at: string
          id: string
          is_admin: boolean | null
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          car_id: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          message: string | null
          status: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          car_id: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          message?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          car_id?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          message?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          body_type: string | null
          brand: string
          color: string | null
          colors: string[] | null
          country: string | null
          created_at: string
          description: string | null
          dimensions: Json | null
          drivetrain: string | null
          engine_capacity: number | null
          engine_fuel_type: string | null
          engine_power: number | null
          engine_torque: number | null
          engine_type: string | null
          features: Json | null
          id: string
          image_url: string | null
          images: Json | null
          is_new: boolean | null
          mileage: number | null
          model: string
          performance: Json | null
          price: number
          price_discount: number | null
          transmission_gears: number | null
          transmission_type: string | null
          updated_at: string
          view_count: number | null
          year: number
        }
        Insert: {
          body_type?: string | null
          brand: string
          color?: string | null
          colors?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          drivetrain?: string | null
          engine_capacity?: number | null
          engine_fuel_type?: string | null
          engine_power?: number | null
          engine_torque?: number | null
          engine_type?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_new?: boolean | null
          mileage?: number | null
          model: string
          performance?: Json | null
          price: number
          price_discount?: number | null
          transmission_gears?: number | null
          transmission_type?: string | null
          updated_at?: string
          view_count?: number | null
          year: number
        }
        Update: {
          body_type?: string | null
          brand?: string
          color?: string | null
          colors?: string[] | null
          country?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          drivetrain?: string | null
          engine_capacity?: number | null
          engine_fuel_type?: string | null
          engine_power?: number | null
          engine_torque?: number | null
          engine_type?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_new?: boolean | null
          mileage?: number | null
          model?: string
          performance?: Json | null
          price?: number
          price_discount?: number | null
          transmission_gears?: number | null
          transmission_type?: string | null
          updated_at?: string
          view_count?: number | null
          year?: number
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
    Enums: {},
  },
} as const
