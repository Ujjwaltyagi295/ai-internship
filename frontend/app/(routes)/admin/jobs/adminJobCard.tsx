"use client"

import * as React from "react"

function getRandomGradient() {
  const gradients = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

type JobCardProps = {
  job: {
    _id?: string
    icon?: React.ReactNode
    company?: string
    title: string
    location?: string
    jobType?: string
    domain?: string
    branch?: string
    salary?: string
    description?: string
    applicants?: number
    applyUrl?: string
  }
  onSelect?: (jobId?: string) => void
}

export function AdminJobCard({ job, onSelect }: JobCardProps) {
  const timePosted = "some dynamic or computed string"
  const hasIcon = Boolean(job.icon)
  const displayIcon =
    job.icon || (job.company ? job.company.charAt(0).toUpperCase() : "J")

  // Safe SSR random color: initialize with a constant, change after hydration
  const [bg, setBg] = React.useState("bg-blue-500")
  React.useEffect(() => {
    setBg(getRandomGradient())
  }, [])

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={() => onSelect?.(job._id)}
    >
      <div className="flex flex-col lg:flex-row lg:gap-4 p-4 lg:p-6 flex-1">
        {/* Left Side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP SECTION */}
          <div className="flex items-start gap-3 mb-3 lg:mb-4">
            {/* ICON */}
            <div
              className={`w-12 h-12 lg:w-20 lg:h-20 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center 
              text-xl lg:text-3xl font-bold flex-shrink-0 ${hasIcon ? "" : "text-white"}`}
            >
              {displayIcon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs lg:text-sm text-gray-500">{timePosted}</span>
                <button className="lg:hidden p-1 hover:bg-gray-100 rounded">
                  <span className="text-xl text-gray-400">•••</span>
                </button>
              </div>

              {/* TITLE */}
              <h3 className="text-base lg:text-xl lg:leading-tight font-bold text-gray-900 line-clamp-2 mb-1">
                {job.title}
              </h3>

              {/* COMPANY / DOMAIN / BRANCH / JOBTYPE */}
              <div className="text-xs lg:text-base lg:leading-tight text-gray-500 line-clamp-1 mb-2">
                {job.company}
                {job.domain && <> / {job.domain}</>}
                {job.branch && <> · {job.branch}</>}
                {job.jobType && <> · {job.jobType}</>}
              </div>
            </div>

            <button className="hidden lg:block p-1 hover:bg-gray-100 rounded flex-shrink-0">
              <span className="text-2xl text-gray-400">•••</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs lg:text-sm text-gray-600">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.location}</span>
              </div>
            )}

            {job.jobType && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.jobType}</span>
              </div>
            )}

            {job.salary && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.salary}</span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {job.description && (
            <div className="text-xs lg:text-sm text-gray-700 mb-3 line-clamp-2">
              {job.description}
            </div>
          )}

          {/* APPLICANTS */}
          {typeof job.applicants === "number" && (
            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-0">
              <span>{job.applicants}+ applicants</span>
            </div>
          )}

         
        </div>
      </div>
    </div>
  )
}
