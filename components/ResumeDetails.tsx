"use client"

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Resume {
  _id: string
  student: {
    _id: string
    name: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    website?: string
  }
  resumeMeta?: {
    fileName?: string
    originalName?: string
    uploadedAt?: Date
  }
  resumeExtract: {
    summary?: string
    skills?: string[]
    projects?: Array<{
      title?: string
      name?: string
      description?: string
      techStack?: string[]
      technologies?: string[]
    }>
    tools?: string[]
    experience?: Array<{
      company?: string
      role?: string
      position?: string
      description?: string
      startDate?: string
      endDate?: string
      duration?: string
    }>
    education?: Array<{
      degree?: string
      field?: string
      institute?: string
      school?: string
      startYear?: string
      endYear?: string
      year?: string
    }>
  }
  parsedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

interface ResumeDisplayProps {
  resume: Resume
}

// Extraction helper functions
function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const match = text.match(emailRegex)
  return match ? match[0] : null
}

function extractPhone(text: string): string | null {
  const phoneRegex = /(\+?\d{1,4}[\s-])?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g
  const match = text.match(phoneRegex)
  return match ? match[0] : null
}

export default function ResumeDisplay({ resume }: ResumeDisplayProps) {
  const { summary = "" } = resume.resumeExtract
  const emailFromSummary = extractEmail(summary)
  const phoneFromSummary = extractPhone(summary)

  const email = emailFromSummary || resume.student.email
  const phone = phoneFromSummary || resume.student.phone

  const linkedinHandle = resume.student.linkedin
    ? resume.student.linkedin.replace("https://www.linkedin.com/in/", "").replace(/\/$/, "")
    : null
  const githubHandle = resume.student.github
    ? resume.student.github.replace("https://github.com/", "").replace(/\/$/, "")
    : null
  const websiteDisplay = resume.student.website?.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-border bg-card p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{resume.student.name}</h1>
            {resume.resumeMeta?.uploadedAt && (
              <p className="mt-2 text-sm text-muted-foreground">
                Last updated {new Date(resume.resumeMeta.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Email</p>
              <p className="text-sm text-foreground">{email || "Not Provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Phone</p>
              <p className="text-sm text-foreground">{phone || "Not Provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Location</p>
              <p className="text-sm text-foreground">{resume.student.location || "Not Provided"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <Linkedin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">LinkedIn</p>
              {linkedinHandle ? (
                <a
                  href={resume.student.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm text-blue-600 hover:underline"
                >
                  linkedin.com/in/{linkedinHandle}
                </a>
              ) : (
                <p className="text-sm text-foreground">Not Provided</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Github className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">GitHub</p>
              {githubHandle ? (
                <a
                  href={resume.student.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm text-blue-600 hover:underline"
                >
                  github.com/{githubHandle}
                </a>
              ) : (
                <p className="text-sm text-foreground">Not Provided</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">Website</p>
              {resume.student.website ? (
                <a
                  href={resume.student.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm text-blue-600 hover:underline"
                >
                  {websiteDisplay}
                </a>
              ) : (
                <p className="text-sm text-foreground">Not Provided</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-8 p-6">
        {summary && (
          <section>
            <h2 className="mb-3 text-xl font-bold text-foreground">SUMMARY</h2>
            <p className="text-sm leading-relaxed text-foreground">{summary}</p>
          </section>
        )}

        {resume.resumeExtract.tools && resume.resumeExtract.tools.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">TECHNICAL SKILLS</h2>
            <div className="flex flex-wrap gap-3">
              {resume.resumeExtract.tools.map((tool, index) => (
                <Badge key={index} variant="secondary" className="cursor-default text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {resume.resumeExtract.experience && resume.resumeExtract.experience.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">EXPERIENCE</h2>
            <div className="space-y-4">
              {resume.resumeExtract.experience.map((job, index) => (
                <div key={index} className="border-l-2 border-border pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.position || job.role}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.startDate} - {job.endDate || "Present"} ({job.duration})
                      </p>
                    </div>
                  </div>
                  {job.description && <p className="mt-2 text-sm text-foreground">{job.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.resumeExtract.education && resume.resumeExtract.education.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">EDUCATION</h2>
            <div className="space-y-4">
              {resume.resumeExtract.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-border pl-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.school || edu.institute}</p>
                    {edu.field && <p className="text-xs text-muted-foreground">{edu.field}</p>}
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-xs text-muted-foreground">
                        {edu.startYear} - {edu.endYear}
                      </span>
                    )}
                    {edu.year && !edu.startYear && !edu.endYear && (
                      <span className="text-xs text-muted-foreground">{edu.year}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.resumeExtract.projects && resume.resumeExtract.projects.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">PROJECTS</h2>
            <div className="space-y-4">
              {resume.resumeExtract.projects.map((project, index) => (
                <div key={index} className="rounded-lg border border-border p-4">
                  <h3 className="font-semibold text-foreground">{project.name || project.title}</h3>
                  {project.description && <p className="mt-2 text-sm text-foreground">{project.description}</p>}
                  {(project.technologies?.length || project.techStack?.length) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies?.map((tech, techIndex) => (
                        <Badge key={"tech-" + techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack?.map((tech, stackIndex) => (
                        <Badge key={"stack-" + stackIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
