// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/config/apiClient"; // Your axios instance with withCredentials: true

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  branch?: string;
  cgpa?: number;
  batch?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  signup: (formData: { name: string; email: string; password: string }) => Promise<{ success: boolean }>;
  login: (formData: { email: string; password: string }) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      signup: async (formData) => {
        set({ loading: true, error: null });

        try {
          // Signup doesn't return token, just creates account
          await API.post("/auth/signup", formData);
          
          set({ loading: false });
          return { success: true };
        } catch (err: any) {
          set({
            loading: false,
            error: err.response?.data?.error || "Signup failed",
          });
          return { success: false };
        }
      },

      login: async (formData) => {
        set({ loading: true, error: null });

        try {
          // Backend sets cookie and returns user data
          const res = await API.post("/auth/login", formData);
          
          // Cookie is automatically set by backend
          // Just store user data from response
          set({
            user: res.data.user, // This is the user object from backend
            isAuthenticated: true,
            loading: false,
          });

          return { success: true };
        } catch (err: any) {
          set({
            loading: false,
            error: err.response?.data?.error || "Login failed",
          });
          return { success: false };
        }
      },

      logout: async () => {
        try {
          await API.post("/auth/logout");
          set({ user: null, isAuthenticated: false });
        } catch (err) {
          // Clear state even if logout request fails
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          // This uses the cookie automatically
          const res = await API.get("/auth/me");
          set({
            user: res.data,
            isAuthenticated: true,
          });
        } catch (err) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
