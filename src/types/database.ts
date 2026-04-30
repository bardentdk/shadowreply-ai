/**
 * Types TypeScript de la base de données Supabase.
 *
 * À long terme, tu pourras les générer automatiquement avec :
 *   npx supabase gen types typescript --project-id YOUR_ID > src/types/database.ts
 *
 * Pour l'instant, on les écrit à la main pour bien comprendre la structure.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserPlan = 'free' | 'pro' | 'enterprise';

export type CommunicationMode =
  | 'dating'
  | 'business'
  | 'conflict'
  | 'friendly'
  | 'cold_polite'
  | 'follow_up'
  | 'apology'
  | 'negotiation';

export type TonePreference = 'balanced' | 'detached' | 'subtle' | 'direct';

/**
 * Type retourné par la fonction RPC can_user_generate.
 */
export interface CanUserGenerateRow {
  can_generate: boolean;
  current_count: number;
  daily_limit: number;
  user_plan: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: UserPlan;
          preferred_tone: TonePreference;
          language: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          subscription_current_period_end: string | null;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: UserPlan;
          preferred_tone?: TonePreference;
          language?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          subscription_current_period_end?: string | null;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: UserPlan;
          preferred_tone?: TonePreference;
          language?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          subscription_current_period_end?: string | null;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          input_message: string;
          context: string | null;
          objective: string | null;
          mode: CommunicationMode;
          ai_response: Json;
          ai_provider: string | null;
          ai_model: string | null;
          tokens_used: number | null;
          is_favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_message: string;
          context?: string | null;
          objective?: string | null;
          mode: CommunicationMode;
          ai_response: Json;
          ai_provider?: string | null;
          ai_model?: string | null;
          tokens_used?: number | null;
          is_favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_message?: string;
          context?: string | null;
          objective?: string | null;
          mode?: CommunicationMode;
          ai_response?: Json;
          ai_provider?: string | null;
          ai_model?: string | null;
          tokens_used?: number | null;
          is_favorite?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'generations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      usage_limits: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          generation_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date?: string;
          generation_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          generation_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'usage_limits_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_stats: {
        Row: {
          user_id: string | null;
          email: string | null;
          plan: UserPlan | null;
          user_created_at: string | null;
          total_generations: number | null;
          favorite_generations: number | null;
          today_generations: number | null;
          week_generations: number | null;
          last_generation_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      increment_generation_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      can_user_generate: {
        Args: { p_user_id: string };
        Returns: CanUserGenerateRow[];
      };
    };
    Enums: {
      user_plan: UserPlan;
      communication_mode: CommunicationMode;
      tone_preference: TonePreference;
    };
    CompositeTypes: Record<string, never>;
  };
};

// Types raccourcis pour faciliter l'utilisation
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Generation = Database['public']['Tables']['generations']['Row'];
export type GenerationInsert = Database['public']['Tables']['generations']['Insert'];
export type GenerationUpdate = Database['public']['Tables']['generations']['Update'];

export type UsageLimit = Database['public']['Tables']['usage_limits']['Row'];
export type UsageLimitInsert = Database['public']['Tables']['usage_limits']['Insert'];
export type UsageLimitUpdate = Database['public']['Tables']['usage_limits']['Update'];

export type UserStats = Database['public']['Views']['user_stats']['Row'];