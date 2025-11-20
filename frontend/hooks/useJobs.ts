"use client";

import { Jobs } from "@/app/api/job";
import { useQuery } from "@tanstack/react-query";

export function useJobs() {
  return useQuery({
    queryKey: ["jobcard"],
    queryFn: Jobs.getJobs,
    staleTime: 1000 * 60 * 2, 
  });
}