"use client";

import * as React from "react";
import { Search, Plus, Briefcase } from "lucide-react";
import { AdminJobCard } from "./adminJobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type Job = {
  _id?: string;
  company: string;
  title: string;
  location: string;
  jobType: string;
  domain: string;
  salary: string;
  description: string;
  applicants: number;
  applyUrl: string;
};

type JobsFilterProps = {
  jobs: Job[];
};

export function JobsFilter({ jobs }: JobsFilterProps) {
  const [search, setSearch] = React.useState("");
  const [jobType, setJobType] = React.useState("all");

  const router = useRouter();

  // Get unique job type values
  const jobTypes = Array.from(new Set(jobs.map((j) => j.jobType)));

  // Filter jobs by search and job type
  const filteredJobs = jobs.filter(
    (job) =>
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase())) &&
      (jobType === "all" || job.jobType === jobType)
  );

  const handleSelectJob = (jobId?: string) => {
    if (jobId) {
      router.push(`/admin/applications?jobId=${jobId}`);
    }
  };

  return (
    <>
      {/* Search Section */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search by job title, company, or location..."
            className="pl-10 py-6 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job Type filter + Post Job button inline */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={jobType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setJobType("all")}
              >
                All
              </Button>
              {jobTypes.map((type) => (
                <Button
                  key={type}
                  variant={jobType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setJobType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <Button
            size="lg"
            className="gap-2 cursor-pointer"
            onClick={() => router.push("/admin/jobs/new")}
          >
            <Plus className="w-5 h-5" />
            <span>Post Job</span>
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {filteredJobs.length} Open Job Postings
            </h2>
            <p className="text-sm text-muted-foreground">
              Quickly post new roles, update content, and manage visibility.
            </p>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map((job, index) => (
              <AdminJobCard key={job._id || index} job={job} onSelect={handleSelectJob} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No jobs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search and job type to find more jobs
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearch("");
                setJobType("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
