import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Real Supabase client
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// Optional logging for debugging
console.log("SUPABASE URL:", supabaseUrl);
console.log("SUPABASE KEY:", supabaseAnonKey ? "Loaded OK" : "Missing!");

// Interfaces
export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  is_approved: boolean;
}

export interface ShopStatus {
  id: string;
  is_open: boolean;
  updated_at: string;
  updated_by: string;
}
