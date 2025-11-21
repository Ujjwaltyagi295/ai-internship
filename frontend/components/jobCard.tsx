"use client";

import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/time";
import { RadialProgress } from "./ui/RadialProgress";
import { useApplyToJob } from "@/hooks/useJobs";

function getRandomGradient() {
  const gradients = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-green-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

export function JobCard({ job }) {
  const router = useRouter();
  const { mutate: apply, isError, isPending } = useApplyToJob();

  const timePosted = timeAgo(job.job.updatedAt || "2025-11-20T10:00:00.000Z");
  const hasIcon = Boolean(job.icon);
  const displayIcon =
    job.icon || (job.company ? job.company.charAt(0).toUpperCase() : "J");
  const bg = hasIcon ? job.bgColor || "bg-blue-100" : getRandomGradient();

  // Ensure skills is an array
  const skills = Array.isArray(job.job.skills) ? job.job.skills : [];

  // 1. Navigate to details page
  const handleCardClick = () => {
    // Uses job.id (which you mapped from _id in the parent component)
    router.push(`/dashboard/job/${job.jobId}`);
  };

  // 2. Stop the card click from firing when clicking Apply
  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition overflow-hidden h-full flex flex-col cursor-pointer"
    >
      <div className="flex flex-col lg:flex-row lg:gap-4 p-4 lg:p-6 flex-1">
        {/* Left Side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP SECTION */}
          <div className="flex items-start gap-3 mb-3 lg:mb-4">
            {/* ICON */}
            <div
              className={`w-12 h-12 lg:w-20 lg:h-20 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center 
                text-xl lg:text-3xl font-bold flex-shrink-0 ${
                  hasIcon ? "" : "text-white"
                }`}
            >
              {displayIcon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs lg:text-sm text-black rounded-4xl bg-[#00f0a01a] p-1 px-3">
                  {timePosted}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent menu click from opening page
                  }}
                  className="lg:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <span className="text-xl text-gray-400">•••</span>
                </button>
              </div>
              <h3 className="text-base lg:text-xl lg:leading-tight font-bold text-gray-900 line-clamp-2 mb-1">
                {job.title}
              </h3>
              <div className="text-xs lg:text-base lg:leading-tight text-gray-500 line-clamp-1 mb-2">
                {job.company}
                {job.job.domain && <> / {job.job.domain}</>}
                {job.job.branch && <> · {job.job.branch}</>}
                {job.job.jobType && <> · {job.job.jobType}</>}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent menu click from opening page
              }}
              className="hidden lg:block p-1 hover:bg-gray-100 rounded flex-shrink-0"
            >
              <span className="text-2xl text-gray-400">•••</span>
            </button>
          </div>

          {/* Info Tags (Location, Salary, etc) */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs lg:text-sm text-gray-600">
            {job.job.location && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.job.location}</span>
              </div>
            )}
            {job.job.jobType && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.job.jobType}</span>
              </div>
            )}
            {job.job.salary && (
              <div className="flex items-center gap-1.5">
                <span className="truncate">{job.job.salary}</span>
              </div>
            )}
          </div>

          {/* Skills Badges */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-gray-500 bg-gray-50">
                  +{skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* APPLY BUTTON */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
            {job.job.applyUrl ? (
              <a
                href={job.job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleButtonClick} // STOP PROPAGATION
                className="w-full lg:w-auto lg:ml-auto text-center px-6 py-2 bg-teal-400 hover:bg-teal-500 cursor-pointer text-white rounded-full text-base font-bold transition"
              >
                APPLY NOW
              </a>
            ) : (
              <button
                onClick={(e) => {
                  handleButtonClick(e); // STOP PROPAGATION
                  // 🟢 UPDATED: Passing object with matchScore
                  apply({ 
                    jobId: job.jobId, 
                    matchScore: job.matchScore 
                  });
                }}
                disabled={isPending}
                className={`w-full lg:w-auto lg:ml-auto text-center px-6 py-2 rounded-full text-base font-bold transition text-white ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-400 hover:bg-teal-500 cursor-pointer"
                }`}
              >
                {isPending ? "Applying..." : "APPLY NOW"}
              </button>
            )}
          </div>
        </div>

        {/* MATCH SCORE */}
        {typeof job.matchScore === "number" && (
          <div className="hidden lg:flex flex-shrink-0 w-48 bg-gradient-to-b from-black to-[#00485f] rounded-xl p-6 flex-col items-center justify-between text-white">
            <div className="flex flex-col items-center justify-center flex-1">
              <RadialProgress
                value={job.matchScore ?? 0}
                size={112}
                strokeWidth={3}
                className="mb-4"
              />
              <div className="text-center text-sm font-bold">MATCH SCORE</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}