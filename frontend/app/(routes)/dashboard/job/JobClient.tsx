"use client";

import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/jobCard";

export default function JobsClient() {
  const { data:jobs, isLoading, isError } = useJobs();

console.log(jobs)
  if (isLoading) return <div>Loading jobs...</div>;
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
