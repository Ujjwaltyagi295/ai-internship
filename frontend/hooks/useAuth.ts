
"use client";

import { auth } from "@/app/api/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: auth.checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000, 
  });
}


export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auth.logout,
    onSuccess: () => {
      queryClient.clear();
      
      router.push("/login");
      router.refresh();
    },
  });
}
export function useIsAuthenticated() {
  const { data, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!data,
    isLoading,
    user: data,
  };
}
