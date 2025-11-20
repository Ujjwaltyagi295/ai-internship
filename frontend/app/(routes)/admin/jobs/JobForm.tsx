"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface JobData {
  title: string
  company: string
  description: string
  requirementsText: string
  skills: string
  tools: string
  branch: string
  domain: string
  jobType: string
  batchAllowed: string
  allowedBranches: string
  minCgpa: string
  salary: string
}

export default function JobForm() {
  const [formData, setFormData] = useState<JobData>({
    title: "",
    company: "",
    description: "",
    requirementsText: "",
    skills: "",
    tools: "",
    branch: "",
    domain: "",
    jobType: "Internship",
    batchAllowed: "",
    allowedBranches: "",
    minCgpa: "",
    salary: "",
  })

  const [aiPrompt, setAiPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAutofill = async () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a job description or details")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/autofill-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to autofill job details")
      }

      const data = await response.json()

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        requirementsText: data.requirementsText || prev.requirementsText,
        skills: data.skills?.join(", ") || prev.skills,
        tools: data.tools?.join(", ") || prev.tools,
        jobType: data.jobType || prev.jobType,
        minCgpa: data.minCgpa ? String(data.minCgpa) : prev.minCgpa,
        salary: data.salary || prev.salary,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting job:", formData)
    alert("Job posted successfully! (Demo)")
  }

  return (
    <div className="space-y-6">
      {/* AI Autofill Section */}
      <Card className="bg-white p-6 border-2 border-indigo-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Autofill</h2>
          <p className="text-sm text-gray-600">Describe the job and let AI fill in the details for you</p>
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Example: We're hiring a senior React developer with 5+ years of experience. They should know TypeScript, Node.js, and have experience with AWS. The position is remote, full-time, and pays $120k-150k..."
            value={aiPrompt}
            onChange={(e) => {
              setAiPrompt(e.target.value)
              setError("")
            }}
            className="min-h-24 resize-none"
          />
          <Button
            onClick={handleAutofill}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white self-start"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autofilling...
              </>
            ) : (
              "Autofill with AI"
            )}
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </Card>

      {/* Job Form */}
      <Card className="bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
                required
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <Input
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., $80k-$120k/year"
              />
            </div>

            {/* Min CGPA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum CGPA</label>
              <Input
                name="minCgpa"
                type="number"
                value={formData.minCgpa}
                onChange={handleInputChange}
                placeholder="e.g., 3.0"
                step="0.1"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <Input
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain/Track</label>
              <Input
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="e.g., Web Development"
              />
            </div>

            {/* Batch Allowed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Allowed (comma-separated)</label>
              <Input
                name="batchAllowed"
                value={formData.batchAllowed}
                onChange={handleInputChange}
                placeholder="e.g., 2025,2026"
              />
            </div>

            {/* Allowed Branches */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Branches (comma-separated)</label>
              <Input
                name="allowedBranches"
                value={formData.allowedBranches}
                onChange={handleInputChange}
                placeholder="e.g., CSE,IT,ECE"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma-separated)</label>
            <Textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., React, TypeScript, Node.js"
              rows={2}
            />
          </div>

          {/* Tools */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tools & Technologies (comma-separated)
            </label>
            <Textarea
              name="tools"
              value={formData.tools}
              onChange={handleInputChange}
              placeholder="e.g., Docker, AWS, PostgreSQL"
              rows={2}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed job description..."
              rows={5}
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <Textarea
              name="requirementsText"
              value={formData.requirementsText}
              onChange={handleInputChange}
              placeholder="What are the key requirements for this position?"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-semibold">
            Create Job Posting
          </Button>
        </form>
      </Card>
    </div>
  )
}
