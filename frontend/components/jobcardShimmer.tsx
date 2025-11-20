import { Skeleton } from "@/components/ui/skeleton"

export function JobCardShimmer() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="flex flex-col lg:flex-row lg:gap-4 p-4 lg:p-6 flex-1">
        {/* Left Side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Icon and Header Section */}
          <div className="flex items-start gap-3 mb-3 lg:mb-4">
            <Skeleton className="w-12 h-12 lg:w-20 lg:h-20 rounded-lg flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="lg:hidden h-6 w-6 rounded" />
              </div>

              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-3/4 mb-1" />

              <Skeleton className="h-4 w-2/3" />
            </div>

            <Skeleton className="hidden lg:block h-6 w-6 rounded flex-shrink-0" />
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-1.5 mb-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          {/* Applicants Section */}
          <Skeleton className="h-3 w-32 mb-3 lg:mb-0" />

          {/* Apply Button */}
          <div className="hidden lg:flex items-center gap-3 pt-4 border-t border-gray-200 mt-auto">
            <Skeleton className="ml-auto px-6 py-2 w-32 h-10 rounded-full" />
          </div>
        </div>

        {/* Match Score Card */}
        <div className="hidden lg:flex flex-shrink-0 w-48 bg-white rounded-xl p-6 flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center flex-1 w-full">
            {/* Radial progress circle skeleton */}
            <Skeleton className="w-28 h-28 rounded-full mb-4" />
            {/* Match score text skeleton */}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
