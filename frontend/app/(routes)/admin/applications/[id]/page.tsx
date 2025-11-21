"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApplicationAttachments } from "./application-files";

import { ProjectSkeleton } from "@/components/Skeletons-cards";
import { formatDate } from "@/lib/date";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useGetApplicationById } from "@/hooks/useJobs";

export default function ApplicationPage() {
  const params = useParams() as { id: string };
  const id = params.id;

  const { toast } = useToast();
  const { data, isError, isLoading } = useGetApplicationById(id);
  console.log(data);
  
  const applications = Array.isArray(data) ? data : [];

  if (isLoading) return <div className="min-h-screen"><ProjectSkeleton /></div>;
  if (isError) return <div>Something went wrong</div>;
  if (!applications.length) return <div>No application found</div>;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <a href="/dashboard/applications" className="flex items-center gap-1 text-slate-700">
              <ArrowLeft className="h-4 w-4" /> Back to Applications
            </a>
          </Button>
        </div>

        {applications.map((application: any, index: number) => {
          const status = application.status;
          const student = application.student || {};
          const job = application.job || {};
          const applicationId = application._id || application.id || index;

          // 🟢 FIXED: Resume extraction logic based on your console log
          let resumeUrl = "";
          const rawResume = student.resume;

          if (rawResume) {
            if (typeof rawResume === "object" && rawResume.cloudinaryUrl) {
              // Case 1: It's an object with cloudinaryUrl (Matches your log)
              resumeUrl = rawResume.cloudinaryUrl;
            } else if (typeof rawResume === "string") {
              // Case 2: It's a direct string
              resumeUrl = rawResume;
            } else if (Array.isArray(rawResume) && rawResume.length > 0) {
              // Case 3: It's an array (legacy)
              resumeUrl = rawResume[0];
            }
          }

          return (
            <div key={applicationId} className="bg-white rounded-xl border shadow-sm mb-6">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage
                        src={student.avatarUrl || ""}
                        alt={student.fullName || "Student"}
                      />
                      <AvatarFallback>
                        {(student.fullName || student.name || "NA").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800">
                        {student.fullName || student.name}
                      </h1>
                      <p className="text-slate-500 break-all">{student.email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline">{job.name || job.title || "Job Title"}</Badge>
                        {status === "UNDER_REVIEW" && (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-700 border-slate-200"
                          >
                            Under Review
                          </Badge>
                        )}
                        {status !== "UNDER_REVIEW" && (
                          <Badge variant="outline" className="capitalize">
                            {status.replace("_", " ").toLowerCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">
                      Notes
                    </h2>
                    <p className="text-slate-600">
                      {application.notes || "No notes provided."}
                    </p>
                  </div>

                  {/* Pass the extracted URL here */}
                  <ApplicationAttachments resumeUrl={resumeUrl} />
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-4 text-slate-700">
                      Application Details
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Status</span>
                        <span className="font-medium capitalize text-slate-800">
                          {status ? status.replace("_", " ").toLowerCase() : "N/A"}
                        </span>
                      </div>

                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Match Score</span>
                        <span className="font-medium text-slate-800">
                          {application.matchScore != null
                            ? `${application.matchScore}%`
                            : "N/A"}
                        </span>
                      </div>

                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Missing Skills</span>
                        <span className="font-medium text-slate-800">
                          {application.missingSkills?.length > 0
                            ? application.missingSkills.join(", ")
                            : "None"}
                        </span>
                      </div>

                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date Applied</span>
                        <span className="font-medium text-slate-800">
                          {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h2 className="text-sm font-medium mb-4 text-slate-700">
                      Job Information
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Job</span>
                        <span className="font-medium text-slate-800">
                          {job.name || job.title || "N/A"}
                        </span>
                      </div>
                      <Separator />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}