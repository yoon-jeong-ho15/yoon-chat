import { create } from "zustand";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User, UserRow } from "../types/user";
import { supabase } from "../lib/supabase";
import { ERROR_MESSAGES } from "../lib/constants";
import {
  isInvalidCredentialsError,
  generateUsernameFromOAuthUser,
} from "../utils/auth";
import { transformUserRow } from "../lib/transformers";

type AuthStore = {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;

  // State setters
  setUser: (user: User | null) => void;
  setSupabaseUser: (user: SupabaseUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  resetAuth: () => void;

  // Business logic
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
  fetchUserProfile: (userId: string) => Promise<void>;
  initAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  supabaseUser: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setSupabaseUser: (supabaseUser) => set({ supabaseUser }),
  setIsLoading: (isLoading) => set({ isLoading }),
  resetAuth: () => set({ user: null, supabaseUser: null }),

  fetchUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        set({ user: transformUserRow(data as UserRow), isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (isInvalidCredentialsError(error.message)) {
          return {
            success: false,
            error: ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
          };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        await get().fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: ERROR_MESSAGES.AUTH.LOGIN_FAILED };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: ERROR_MESSAGES.AUTH.LOGIN_ERROR };
    }
  },

  loginWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: ERROR_MESSAGES.AUTH.GOOGLE_LOGIN_ERROR };
    }
  },

  signup: async (
    email: string,
    password: string,
    username: string,
    metadata?: Record<string, string>
  ) => {
    try {
      if (!email || !password || !username) {
        return {
          success: false,
          error: ERROR_MESSAGES.AUTH.ALL_FIELDS_REQUIRED,
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            ...metadata,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("user").insert({
          id: data.user.id,
          username,
          profile_img: metadata?.profile_img || "",
          email: data.user.email || "",
          provider: "email",
        });

        if (profileError) {
          console.error(
            ERROR_MESSAGES.AUTH.PROFILE_CREATE_FAILED,
            profileError
          );
          return {
            success: false,
            error: ERROR_MESSAGES.AUTH.PROFILE_CREATE_FAILED,
          };
        }

        return { success: true };
      }

      return { success: false, error: ERROR_MESSAGES.AUTH.SIGNUP_FAILED };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: ERROR_MESSAGES.AUTH.SIGNUP_ERROR };
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      get().resetAuth();
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Initialize auth listener (call this once in App.tsx)
  initAuth: async () => {
    // Get initial session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      set({ supabaseUser: session.user });

      // Fetch or create user profile
      try {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (data) {
          set({ user: transformUserRow(data as UserRow), isLoading: false });
        } else if (error) {
          // If profile doesn't exist, create one for OAuth users
          const username = generateUsernameFromOAuthUser(session.user);
          const provider = session.user.app_metadata?.provider || "email";

          const { data: newProfile, error: insertError } = await supabase
            .from("user")
            .insert({
              id: session.user.id,
              username,
              profile_img: session.user.user_metadata?.avatar_url || "",
            })
            .select()
            .single();

          if (insertError) {
            console.error(
              ERROR_MESSAGES.AUTH.PROFILE_CREATE_FAILED,
              insertError
            );
            set({ isLoading: false });
          } else if (newProfile) {
            set({
              user: transformUserRow(newProfile as UserRow),
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.error("Error in fetchOrCreateUserProfile:", error);
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ supabaseUser: session?.user ?? null });

      if (session?.user) {
        await get().fetchUserProfile(session.user.id);
      } else {
        get().resetAuth();
        set({ isLoading: false });
      }
    });
  },
}));

// Custom hooks for convenience (matching your modalStore pattern)
export const useAuth = () => {
  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);

  return { login, loginWithGoogle, signup, logout };
};

export const useAuthContext = () => {
  const user = useAuthStore((state) => state.user);
  const supabaseUser = useAuthStore((state) => state.supabaseUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  return { user, supabaseUser, isLoading };
};
