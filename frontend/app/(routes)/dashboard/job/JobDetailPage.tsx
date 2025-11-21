"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";


export default function JobDetailPage({ job }: JobCardProps) {
const router = useRouter();
  const [liked, setLiked] = useState(false)
  const displayTags = [...(job.skills || []), ...(job.tools || []), job.branch, job.domain].filter(Boolean) as string[]
  console.log(job.title)
  const safeMatchScore = job.matchScore || 0
  const hasMatchScore = typeof job.matchScore === "number"

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
  onClick={() => router.back()}
 className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X size={20} />
            </button>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Job Details</span>
          </div>
          <div className="flex items-center gap-3">
          
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2">

            {/* Company */}
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ backgroundColor: job.bgColor || "#3B82F6" }}
                >
                  {job.icon || job?.company?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-muted-foreground mb-1">{job.company}</h2>
                  <h1 className="text-4xl font-bold text-foreground">{job.title}</h1>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {job.location && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    
                      <span className="text-xs font-semibold uppercase tracking-wider">Location</span>
                    </div>
                    <p className="font-semibold text-foreground">{job.location}</p>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  
                    <span className="text-xs font-semibold uppercase tracking-wider">Type</span>
                  </div>
                  <p className="font-semibold text-foreground capitalize">{job.jobType?.replace("_", " ")}</p>
                </div>
                {job.salary && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                     
                      <span className="text-xs font-semibold uppercase tracking-wider">Salary</span>
                    </div>
                    <p className="font-semibold text-foreground">{job.salary}</p>
                  </div>
                )}
                {job.applicants !== undefined && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    
                      <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
                    </div>
                    <p className="font-semibold text-foreground">{job.applicants} people</p>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            <div className="mb-12 pb-12 border-b border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">About the role</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{job.description}</p>

              {job.requirementsText && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Requirements</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.requirementsText}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {displayTags.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  Skills required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="px-3 py-1.5 bg-muted text-foreground rounded-full text-sm font-medium border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">

            {/* Match Score */}
            {hasMatchScore && (
              <div className="bg-muted/50 border border-border rounded-2xl p-8 mb-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 text-center">
                  Your Match
                </h3>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" className="stroke-border" strokeWidth="8" />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54 * (safeMatchScore / 100)} ${2 * Math.PI * 54}`}
                        className={`${safeMatchScore > 70 ? "text-emerald-600 dark:text-emerald-400" : safeMatchScore > 40 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"} transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{safeMatchScore}%</span>
                      <span className="text-xs font-medium text-muted-foreground mt-1">match</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Based on your profile and job requirements
                  </p>
                </div>
              </div>
            )}

            {/* Requirements Card */}
            <div className="bg-muted/50 border border-border rounded-2xl p-8">
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                
                Qualifications
              </h4>

              <div className="space-y-5">
                {job.minCgpa && (
                  <div className="flex gap-3">
                    <span className="text-xl flex-shrink-0">📊</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        Min GPA
                      </p>
                      <p className="font-semibold text-foreground">{job.minCgpa} / 10</p>
                    </div>
                  </div>
                )}

                {job.allowedBranches && job.allowedBranches.length > 0 && (
                  <div className="flex gap-3">
                    <span className="text-xl flex-shrink-0">🎓</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        Branches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.allowedBranches.map((b) => (
                          <span
                            key={b}
                            className="text-xs bg-background px-2 py-1 rounded-lg text-foreground font-medium border border-border"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {job.batchAllowed && job.batchAllowed.length > 0 && (
                  <div className="flex gap-3">
                    <span className="text-xl flex-shrink-0">📅</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        Batch Year
                      </p>
                      <p className="font-semibold text-foreground">{job.batchAllowed.join(", ")}</p>
                    </div>
                  </div>
                )}

                {!job.minCgpa &&
                  (!job.allowedBranches || job.allowedBranches.length === 0) &&
                  (!job.batchAllowed || job.batchAllowed.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">No specific requirements listed</p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
