// config/api/auth.ts
import API from "@/config/apiClient";

export const auth = {
  checkAuth: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },

 
};
