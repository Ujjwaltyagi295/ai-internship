// models/jobModel.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    description: { type: String, required: true },
    requirementsText: { type: String }, // optional cleaned text
    skills: { type: [String], default: [] }, // parsed skills
    tools: { type: [String], default: [] },   // parsed tools (for AI/job filters)
    branch: { type: String, trim: true },     // optional branch preference
    domain: { type: String, trim: true },     // optional domain/track
    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Contract", "Remote"],
      default: "Internship",
    },
    batchAllowed: { type: [String], default: [] }, // e.g. ["2026","2025"]
    allowedBranches: { type: [String], default: [] },
    minCgpa: { type: Number },
    salary: { type: String, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // admin id
    // External apply link flow:
    externalApply: { type: Boolean, default: false },
    applyUrl: { type: String, trim: true }, // if externalApply = true, frontend redirects to this
    // Internal flow:
    internalNotes: { type: String }, // optional notes for admin
    // AI fields:
    embedding: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
