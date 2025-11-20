"use client"

import * as React from "react"
import { Search, Plus, Briefcase } from "lucide-react"
import { AdminJobCard } from "./adminJobCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockJobs = [
  {
    company: "Google",
    title: "Frontend Engineer",
    location: "Bangalore, India",
    jobType: "Full-time",
    domain: "Web Development",
    salary: "₹20L - ₹30L",
    description:
      "Work on scalable frontend web apps with React and TypeScript. Join our team to build products used by millions.",
    applicants: 12,
    applyUrl: "https://careers.google.com/jobs/frontend-engineer",
  },
  {
    company: "Amazon",
    title: "Backend Developer",
    location: "Hyderabad, India",
    jobType: "Internship",
    domain: "Cloud Services",
    salary: "₹18L",
    description: "Maintain serverless APIs using Node.js and AWS Lambda. Work with cutting-edge cloud technologies.",
    applicants: 23,
    applyUrl: "https://www.amazon.jobs/backend-intern",
  },
  {
    company: "Meta",
    title: "UI/UX Designer",
    location: "Remote",
    jobType: "Contract",
    domain: "Design",
    salary: "₹10L - ₹18L",
    description:
      "Design modern interactive interfaces for web and mobile. Create experiences that connect billions of people.",
    applicants: 8,
    applyUrl: "https://careers.facebook.com/ui-ux",
  },
  {
    company: "Microsoft",
    title: "Full Stack Developer",
    location: "Mumbai, India",
    jobType: "Full-time",
    domain: "Web Development",
    salary: "₹25L - ₹35L",
    description:
      "Build enterprise-scale applications with modern technologies. Work on products used by millions worldwide.",
    applicants: 18,
    applyUrl: "https://careers.microsoft.com",
  },
  {
    company: "Apple",
    title: "iOS Developer",
    location: "Bangalore, India",
    jobType: "Full-time",
    domain: "Mobile Development",
    salary: "₹22L - ₹32L",
    description:
      "Create innovative iOS applications for millions of users. Work with the latest Swift and SwiftUI technologies.",
    applicants: 15,
    applyUrl: "https://careers.apple.com",
  },
  {
    company: "Netflix",
    title: "Data Engineer",
    location: "Remote",
    jobType: "Full-time",
    domain: "Data & Analytics",
    salary: "₹28L - ₹40L",
    description:
      "Build data pipelines that power recommendations for millions of users. Work with cutting-edge data technologies.",
    applicants: 9,
    applyUrl: "https://careers.netflix.com",
  },
]

export default function JobsDashboard() {
  const [search, setSearch] = React.useState("")
  const [jobType, setJobType] = React.useState("all")

  // Get unique job type values
  const jobTypes = Array.from(new Set(mockJobs.map((j) => j.jobType)))

  // Filter jobs by search and job type
  const filteredJobs = mockJobs.filter((job) =>
    (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
    ) &&
    (jobType === "all" || job.jobType === jobType)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Jobs Board</h1>
                <p className="text-sm text-muted-foreground">Manage and post job listings</p>
              </div>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              <span>Post Job</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Job Type</label>
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
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h2>
              <p className="text-sm text-muted-foreground">Browse and apply to open positions</p>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-4">
              {filteredJobs.map((job, index) => (
                <AdminJobCard key={index} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search and job type to find more jobs</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearch("")
                  setJobType("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
