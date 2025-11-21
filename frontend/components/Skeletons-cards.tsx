import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex w-full max-w-md flex-col justify-between rounded-xl border p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Avatar */}
        <Skeleton className="h-12 w-12 rounded-md" />

        {/* Title and Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Tech tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* Footer section */}
      <div className="mt-4 grid grid-cols-2 items-center justify-between border-t pt-4 text-sm">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Bottom apply button */}
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}


export  function ProjectSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <Skeleton className="h-10 w-3/4 mb-6" />

      {/* Introduction paragraph */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-4/5 mb-8" />

      {/* Additional Requirements Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <Skeleton className="h-7 w-2/5 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Commitment */}
          <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          {/* Meeting Frequency */}
          <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>

          {/* Timezone Preference */}
          <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          {/* Hours Per Week */}
          <div>
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        </div>

        {/* Application Process */}
        <div className="mt-6">
          <Skeleton className="h-6 w-2/5 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-10/12 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Open Roles */}
      <Skeleton className="h-8 w-1/4 mb-4" />
      <Skeleton className="h-[1px] w-full bg-gray-200 mb-6" />

      {/* Role Cards - Just showing placeholders */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}