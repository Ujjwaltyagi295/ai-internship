"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateJob, useJobAutoFill } from "@/hooks/useJobs";

interface JobData {
  title: string;
  company: string;
  description: string;
  requirementsText: string;
  skills: string;
  tools: string;
  branch: string;
  domain: string;
  jobType: string;
  batchAllowed: string;
  allowedBranches: string;
  minCgpa: string;
  salary: string;
  externalApply: boolean;
  applyUrl?: string;
}

export default function JobForm() {
  const router = useRouter();

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
    externalApply: false,
    applyUrl: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [error, setError] = useState("");

  // AI Autofill mutation hook
  const {
    mutate: autoFillJob,
    data: autoFillData,
    isPending: isAutoFillPending,
    isError: isAutoFillError,
    error: autoFillError,
    isSuccess: isAutoFillSuccess,
  } = useJobAutoFill();

  // Job creation mutation hook
  const {
    mutate: createJob,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
    isSuccess: isCreateSuccess,
  } = useCreateJob();

  // Update form fields on successful AI autofill
  useEffect(() => {
    if (isAutoFillSuccess && autoFillData) {
      setFormData((prev) => ({
        ...prev,
        title: autoFillData.title || prev.title,
        company: autoFillData.company || prev.company,
        description: autoFillData.description || prev.description,
        requirementsText:
          autoFillData.requirementsText || prev.requirementsText,
        skills: Array.isArray(autoFillData.skills)
          ? autoFillData.skills.join(", ")
          : prev.skills,
        tools: Array.isArray(autoFillData.tools)
          ? autoFillData.tools.join(", ")
          : prev.tools,
        branch: autoFillData.branch || prev.branch,
        domain: autoFillData.domain || prev.domain,
        jobType: autoFillData.jobType || prev.jobType,
        batchAllowed: Array.isArray(autoFillData.batchAllowed)
          ? autoFillData.batchAllowed.join(", ")
          : autoFillData.batchAllowed || prev.batchAllowed,
        allowedBranches: Array.isArray(autoFillData.allowedBranches)
          ? autoFillData.allowedBranches.join(", ")
          : autoFillData.allowedBranches || prev.allowedBranches,
        minCgpa: autoFillData.minCgpa
          ? String(autoFillData.minCgpa)
          : prev.minCgpa,
        salary: autoFillData.salary || prev.salary,
        externalApply:
          typeof autoFillData.externalApply === "boolean"
            ? autoFillData.externalApply
            : prev.externalApply,
        applyUrl: autoFillData.applyUrl || prev.applyUrl,
      }));

      toast.success("AI autofilled job details");
    }
  }, [isAutoFillSuccess, autoFillData]);

  // Redirect and toast on successful create
  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Job created successfully");
      router.push("/admin/jobs");
    }
  }, [isCreateSuccess, router]);

  // Handle input and textarea changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select component change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for external apply toggle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      externalApply: checked,
      applyUrl: checked ? prev.applyUrl : "",
    }));
  };

  // Trigger AI autofill mutation
  const handleAutofill = () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a job description or details");
      toast.error("Please enter a job description or details");
      return;
    }
    setError("");
    toast.loading("Generating job details with AI...");
    autoFillJob(aiPrompt, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("AI autofill completed");
      },
      onError: () => {
        toast.dismiss();
        toast.error("Failed to autofill job details");
      },
    });
  };

  // Prepare and submit the job creation mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: formData.tools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      batchAllowed: formData.batchAllowed
        ? formData.batchAllowed
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
      allowedBranches: formData.allowedBranches
        ? formData.allowedBranches
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
      minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : undefined,
      branch: formData.branch.toLowerCase(),
      domain: formData.domain.toLowerCase(),
      applyUrl: formData.externalApply ? formData.applyUrl : undefined,
    };

    toast.loading("Creating job posting...");
    createJob(payload, {
      onSuccess: () => {
        toast.dismiss();
        // success toast + redirect handled in useEffect
      },
      onError: () => {
        toast.dismiss();
        toast.error("Failed to create job");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Autofill Section */}
      <Card className="bg-white p-6 border-2 border-indigo-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            AI Autofill
          </h2>
          <p className="text-sm text-gray-600">
            Describe the job and let AI fill in the details for you
          </p>
        </div>

        <div className="flex gap-2">
          <Textarea
            placeholder="Example: We're hiring a senior React developer..."
            value={aiPrompt}
            onChange={(e) => {
              setAiPrompt(e.target.value);
              setError("");
            }}
            className="min-h-24 resize-none h-24"
          />
          <Button
            onClick={handleAutofill}
            disabled={isAutoFillPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white self-start"
          >
            {isAutoFillPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autofilling...
              </>
            ) : (
              "Autofill with AI"
            )}
          </Button>
        </div>

        {(error || isAutoFillError) && (
          <p className="text-red-600 text-sm mt-2">
            {error || autoFillError?.message || "Failed to autofill job details"}
          </p>
        )}
      </Card>

      {/* Job Form */}
      <Card className="bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => handleSelectChange("jobType", value)}
              >
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <Input
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., ₹8LPA - ₹12LPA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum CGPA
              </label>
              <Input
                name="minCgpa"
                type="number"
                value={formData.minCgpa}
                onChange={handleInputChange}
                placeholder="e.g., 7.0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <Input
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain/Track
              </label>
              <Input
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                placeholder="e.g., Web Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Allowed (comma-separated)
              </label>
              <Input
                name="batchAllowed"
                value={formData.batchAllowed}
                onChange={handleInputChange}
                placeholder="e.g., 2025, 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowed Branches (comma-separated)
              </label>
              <Input
                name="allowedBranches"
                value={formData.allowedBranches}
                onChange={handleInputChange}
                placeholder="e.g., CSE, IT, ECE"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills (comma-separated)
            </label>
            <Textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., React, TypeScript, Node.js"
              rows={2}
              className="resize-none h-16"
            />
          </div>

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
              className="resize-none h-16"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed job description..."
              rows={5}
              required
              className="resize-none h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <Textarea
              name="requirementsText"
              value={formData.requirementsText}
              onChange={handleInputChange}
              placeholder="What are the key requirements for this position?"
              rows={4}
              className="resize-none h-20"
            />
          </div>

          {/* External Apply Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="externalApply"
              checked={formData.externalApply}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="externalApply"
              className="text-sm font-medium text-gray-700"
            >
              External Apply
            </label>
          </div>

          {/* Conditionally show Apply URL */}
          {formData.externalApply && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apply URL
              </label>
              <Input
                name="applyUrl"
                value={formData.applyUrl || ""}
                onChange={handleInputChange}
                placeholder="e.g., https://company.com/apply"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-semibold"
            disabled={isCreatePending}
          >
            {isCreatePending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Job Posting"
            )}
          </Button>

          {isCreateError && createError && (
            <p className="text-red-600 text-sm mt-2">
              {createError.message || "Failed to create job"}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
