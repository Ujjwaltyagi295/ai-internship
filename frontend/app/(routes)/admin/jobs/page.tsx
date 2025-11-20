
import { JobsFilter } from "./jobFilter"

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
    description:
      "Maintain serverless APIs using Node.js and AWS Lambda. Work with cutting-edge cloud technologies.",
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
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobsFilter jobs={mockJobs} />
      </div>
    </div>
  )
}
