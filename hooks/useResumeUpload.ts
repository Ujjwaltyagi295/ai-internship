// hooks/useResumeUpload.ts
"use client";

import { students } from "@/app/api/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResumeUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => students.uploadResume(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["getResume"] });
      
      toast.success("Resume uploaded successfully!");
      console.log("Upload response:", data);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to upload resume";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    },
  });
}

export function useResumeDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => students.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["getResume"] });
      toast.success("Resume deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to delete resume";
      toast.error(errorMessage);
    },
  });
}

export function useGetResumeData() {
  return useQuery({
    queryKey: ["getResume"],
    queryFn: students.getMyResumeData,
    retry: false,
  });
}
