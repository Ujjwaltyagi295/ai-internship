"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { ApplicationStats } from "@/components/section-cards";
import { Jobs } from "@/app/api/job";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function DashboardPage() {
  const params = useSearchParams();
  const jobId = params.get("jobId") || undefined;

  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined);

  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ["job-applications", jobId, statusFilter],
    enabled: Boolean(jobId),
    queryFn: () =>
      Jobs.getJobApplications(
        jobId as string,
        statusFilter
          ? [statusFilter.toUpperCase().replace(/\s+/g, "_")]
          : undefined
      ),
  });

  const { data: jobDetail } = useQuery({
    queryKey: ["admin-job-detail", jobId],
    enabled: Boolean(jobId),
    queryFn: () => Jobs.getJobById(jobId as string),
  });

  const jobTitle = jobDetail?.title || jobDetail?.job?.title || undefined;

  const tableData = useMemo(() => {
    if (!applications || !Array.isArray(applications)) return [];
    return applications.map((app: any, idx: number) => {
      const student = app.student || {};
      const job = app.job || {};

      const matchScore = typeof app.matchScore === "number" ? app.matchScore : 0;
      const createdAt = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "--";
      const status =
        typeof app.status === "string"
          ? app.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : "Under Review";

      return {
        id: app._id || idx,
        applicationId: app._id || idx,
        name: student.name || "Unknown",
        email: student.email || "N/A",
        initials: (student.name || "NA").slice(0, 2).toUpperCase(),
        company: job.company || "N/A",
        dateApplied: createdAt,
        matchScore,
        status,
      };
    });
  }, [applications]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <ApplicationStats />
      <div className="px-4 lg:px-6">
        {jobId ? (
          <p className="text-sm text-muted-foreground">
            {jobTitle
              ? `Showing analytics and applicants for ${jobTitle}`
              : `Showing analytics and applicants for job ${jobId}`}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a job from the admin jobs page to view applications.
          </p>
        )}
      </div>
      <DataTable
        jobId={jobId}
        jobTitle={jobTitle}
        data={tableData}
        isLoading={isLoading}
        isError={isError}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
