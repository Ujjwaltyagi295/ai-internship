"use client";

import { Jobs } from "@/app/api/job";
import { useMutation, useQuery } from "@tanstack/react-query";
interface JobCardProps {

    title: string
    company: string
    description: string
    requirementsText?: string
    skills?: string[]
    tools?: string[]
    branch?: string
    domain?: string
    jobType: string
    batchAllowed?: string[]
    allowedBranches?: string[]
    minCgpa?: number
    salary?: string
    externalApply?: boolean
    applyUrl?: string
    location?: string
    applicants?: number
    matchScore?: number
    icon?: string
    bgColor?: string

}

export function useJobs() {
  return useQuery({
    queryKey: ["jobcard"],
    queryFn: Jobs.getJobs,
    staleTime: 1000 * 60 * 2, 
  });
}

export function useAdminJobs() {
  return useQuery({
    queryKey: ["admin-jobs"],
    queryFn: Jobs.getAdminJobs,
    staleTime: 1000 * 60 * 1,
  });
}
export function useJobAutoFill() {
  return useMutation({
    mutationFn: (data: string) => Jobs.getAutofill(data),
    onSuccess: (data) => {
      console.log("Autofill response:", data);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to autofill job data";
      console.error("Autofill error:", errorMessage);
    },
  });
}export function useCreateJob() {
  return useMutation({
    mutationFn: (data: JobCardProps) => Jobs.createJobs(data),
    onSuccess: (data) => {
      console.log('Job created successfully:', data);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.error || 'Job creation failed';
      console.error('Create job error:', errMsg);
     
    },
  }); }
  export function useApplyToJob() {
  return useMutation({
    mutationFn: (jobid:string) => Jobs.applyToJob(jobid),
    onSuccess: (data) => {
      console.log('applied successfully:', data);
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.error || 'application  failed';
      console.error('application failed error:', errMsg);
     
    },
  });
}

 export function useGetJobById() {
  return useMutation({
    mutationFn: (id:string) => Jobs.getJobById(id),
    onSuccess: () => {
      console.log('fetched data by id successfully:');
    },
    onError: (error: any) => {
      const errMsg = error.response?.data?.error || '  failed';
      console.error('fetched by id failed error:', errMsg);
     
    },
  });
}
