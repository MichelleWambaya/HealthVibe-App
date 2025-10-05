import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  remedy_count: number;
  created_at: string;
  updated_at: string;
}

export interface Remedy {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparation_time: string;
  relief_time: string;
  precautions: string[];
  category_id: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  effectiveness: number;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  remedy_id: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  favorite_categories: string[];
  created_at: string;
  updated_at: string;
}
