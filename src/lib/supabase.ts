import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Browser client (for client-side operations)
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Types for database
export interface Database {
  public: {
    Tables: {
      attendees: {
        Row: {
          id: string;
          name: string;
          school: string;
          school_other: string | null;
          class: string;
          class_other: string | null;
          is_attending: boolean;
          reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          school: string;
          school_other?: string | null;
          class: string;
          class_other?: string | null;
          is_attending: boolean;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          school?: string;
          school_other?: string | null;
          class?: string;
          class_other?: string | null;
          is_attending?: boolean;
          reason?: string | null;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          created_at?: string;
        };
        Update: {
          username?: string;
          password_hash?: string;
        };
      };
    };
  };
}

export type Attendee = Database['public']['Tables']['attendees']['Row'];
export type AttendeeInsert = Database['public']['Tables']['attendees']['Insert'];
export type AttendeeUpdate = Database['public']['Tables']['attendees']['Update'];
