// controllers/jobController.js
import Job from "../models/jobModel.js";
import Application from "../models/applicationModel.js";
import Student from "../models/studentModel.js";
import { parseJobText } from "../services/jobParser.js";

export const createJobFromText = async (req, res) => {
  try {
    // 1. Get the raw text input
    const { text } = req.body; // 'postedBy' is no longer needed if not saving

    if (!text) return res.status(400).json({ error: "Text is required" });

    // 2. AI Structuring
    console.log("🤖 AI is analyzing text...");
    const aiData = await parseJobText(text);

    if (!aiData) {
      return res.status(500).json({ error: "AI could not structure this data." });
    }

    // 3. Prepare Response Object (No DB Saving)
    // We construct the object exactly how it would look, but strictly for the response.
    const structuredJob = {
      ...aiData, 
      externalApply: !!aiData.applyUrl, // Keep this logic so the frontend sees the derived boolean
      requirementsText: text,
    };

    // 4. Return the data
    // Changed status from 201 (Created) to 200 (OK) since nothing is stored.
    res.status(200).json({
      success: true,
      message: "Job data structured successfully.",
      data: structuredJob
    });

  } catch (error) {
    console.error("Error analyzing job text:", error);
    res.status(500).json({ error: error.message });
  }
};
// Admin: create job
export const createJob = async (req, res) => {
  try {
    // 1. Extract the 'data' object from req.body
    // If the frontend sends { data: { ... } }, we use that. 
    // Otherwise, we fallback to req.body for backward compatibility.
    const sourceData = req.body.data || req.body;

    console.log("Received Payload:", sourceData);

    // 2. Initialize payload
    const payload = { ...sourceData };

    // 3. Attach User ID
    payload.postedBy = req.user.id;

    // 4. Sanitize Arrays (Skills, Tools, Batch, Branches)
    // We ensure these are arrays and filter out empty values
    payload.skills = Array.isArray(payload.skills)
      ? payload.skills.filter(Boolean)
      : [];

    payload.tools = Array.isArray(payload.tools)
      ? payload.tools.filter(Boolean)
      : [];
    
    payload.batchAllowed = Array.isArray(payload.batchAllowed) 
      ? payload.batchAllowed 
      : [];

    payload.allowedBranches = Array.isArray(payload.allowedBranches) 
      ? payload.allowedBranches 
      : [];

    // 5. Handle Text Fields
    payload.requirementsText =
      payload.requirementsText || payload.description || "";

    // 6. Normalize specific fields to lowercase for better search/matching
    if (payload.branch) payload.branch = payload.branch.toLowerCase();
    if (payload.domain) payload.domain = payload.domain.toLowerCase();

    // 7. Create Job
    const job = await Job.create(payload);

    res.status(201).json({ msg: "Job created successfully", job });
  } catch (err) {
    console.error("Job creation error:", err); // Log the actual error for debugging
    res.status(500).json({ error: "Job creation failed", details: err.message });
  }
};


// Public: list jobs with optional filters
export const getJobs = async (req, res) => {
  try {
    const q = {};
    // Optional filters
    if (req.query.jobType) q.jobType = req.query.jobType;
    if (req.query.batch) q.batchAllowed = { $in: [req.query.batch] };

    const jobs = await Job.find(q).sort({ createdAt: -1 }).lean();
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

/**
 * Apply to job:
 * - If job.externalApply === true -> return applyUrl (frontend should open)
 * - Else -> create Application document (internal flow)
 *
 * Body for internal apply: { jobId }
 */
export const applyToJob = async (req, res) => {
  try {
   const { jobId } = req.body;
    console.log(req.body)
    if (!jobId) return res.status(400).json({ error: "jobId required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.externalApply && job.applyUrl) {
      // External apply flow: send URL to client
      return res.json({ external: true, applyUrl: job.applyUrl });
    }

    // Internal apply flow: create Application if not exists
    const existing = await Application.findOne({ student: req.user.id, job: jobId });
    if (existing) return res.status(400).json({ error: "Already applied" });

    // Optionally take a snapshot of student's resume metadata
    const student = await Student.findById(req.user.id).lean();

    const app = await Application.create({
      student: req.user.id,
      job: jobId,
      resumeSnapshot: student.resume || undefined,
    });

    res.status(201).json({ msg: "Applied successfully", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Apply failed" });
  }
};
