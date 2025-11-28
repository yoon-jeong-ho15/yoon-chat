import { createContext } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { AuthUser } from "../lib/types";

export interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: SupabaseUser | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    username: string,
    metadata?: Record<string, string>
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
