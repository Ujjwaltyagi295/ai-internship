interface JobCardProps {
  job: {
    id: string | number
    title: string
    company: string
    description: string
    requirementsText?: string
    skills?: string[]
    tools?: string[]
    branch?: string
    domain?: string
    jobType: string
    batchAllowed?: string[]
    allowedBranches?: string[]
    minCgpa?: number
    salary?: string
    externalApply?: boolean
    applyUrl?: string
    location?: string
    applicants?: number
    matchScore?: number
    icon?: string
    bgColor?: string
  }
}
