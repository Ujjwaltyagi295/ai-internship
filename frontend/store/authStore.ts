import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  signup: async (formData) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/api/auth/signup", formData);

      set({
        user: res.data.user,
        token: res.data.token,
        loading: false,
      });

      return { success: true };
    } catch (err) {
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
      const res = await axios.post("/api/auth/login", formData);

      set({
        user: res.data.user,
        token: res.data.token,
        loading: false,
      });

      localStorage.setItem("token", res.data.token);

      return { success: true };
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.error || "Login failed",
      });

      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  loadUser: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token });
    }
  },
}));

export default useAuthStore;
