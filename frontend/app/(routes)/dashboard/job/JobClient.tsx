"use client";

import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobCard";
import { JobCardShimmer } from "@/components/jobcardShimmer";

export default function JobsClient() {
  const { data:jobs, isLoading, isError } = useJobs();

console.log(jobs)
  if (isLoading) return <div> <main className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>

        <div className="space-y-4">
          <JobCardShimmer/>
          <JobCardShimmer />
          <JobCardShimmer />
        </div>
      </div>
    </main></div>;
  if (isError) return <div>Failed to load jobs.</div>;

  return (
    <div className="flex flex-col gap-4 pt-6 pb-6 overflow-y-auto no-scrollbar flex-1">
      {jobs.map((job,idx) => (
        <div key={idx} className="min-h-[280px] lg:h-[calc((100vh-240px)/2.5)]">
          <JobCard job={{ ...job, id: job._id }} />
        </div>
      ))}
    </div>
  );
}
