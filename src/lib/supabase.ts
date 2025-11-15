import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
