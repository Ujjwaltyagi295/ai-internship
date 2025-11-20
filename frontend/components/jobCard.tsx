import { RadialProgress } from "./ui/RadialProgress";

function getRandomGradient() {
  const gradients = [
    "bg-blue-500 ",
    "bg-purple-500 ",
    "bg-rose-500 ",
    "bg-green-500 ",
    "bg-indigo-500 ",
    "bg-teal-500 ",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

export function JobCard({ job }: JobCardProps) {
  const timePosted = "some dynamic or computed string";

  const hasIcon = Boolean(job.icon);

  const displayIcon =
    job.icon || (job.company ? job.company.charAt(0).toUpperCase() : "J");

  const bg = hasIcon
    ? job.bgColor || "bg-blue-100"
    : getRandomGradient();

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition overflow-hidden h-full flex flex-col">
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

          {/* APPLY BUTTON */}
         <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
  <a
    href={job.applyUrl || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="ml-auto px-6 py-2 bg-teal-400 hover:bg-teal-500 cursor-pointer text-white rounded-full text-base font-bold transition"
  >
    APPLY NOW
  </a>
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
