// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "@/config/apiClient"; 

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
          const res = await API.post("/auth/login", formData);
          
          set({
            user: res.data.user, 
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
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
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
