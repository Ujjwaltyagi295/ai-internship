"use client";

import { useAdminJobs } from "@/hooks/useJobs";
import { JobsFilter } from "./jobFilter";

export default function JobsDashboard() {
  const { data, isLoading, isError } = useAdminJobs();
  const jobs = data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-muted-foreground">Loading jobs…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-red-500">
            Failed to load jobs. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobsFilter jobs={jobs} />
      </div>
    </div>
  );
}
