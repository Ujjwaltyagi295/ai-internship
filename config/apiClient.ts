// lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000/api",
  withCredentials: true, 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      if (typeof window !== "undefined" && !isRedirecting) {
        isRedirecting = true;
        
        const currentPath = window.location.pathname;
        
        if (currentPath !== "/auth/login") {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
