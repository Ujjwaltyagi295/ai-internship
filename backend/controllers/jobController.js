// controllers/jobController.js
import Job from "../models/jobModel.js";
import Application from "../models/applicationModel.js";
import Student from "../models/studentModel.js";
import { parseJobText } from "../services/jobParser.js";

export const createJobFromText = async (req, res) => {
  try {
    // 1. Get the raw text input
    // Example input: "Looking for a React intern 2025 batch knows Figma salary 15k"
    const { text, postedBy } = req.body; 

    if (!text) return res.status(400).json({ error: "Text is required" });

    // 2. AI Structuring
    console.log("🤖 AI is analyzing text...");
    const aiData = await parseJobText(text);

    if (!aiData) {
      return res.status(500).json({ error: "AI could not structure this data." });
    }

    // 3. Create the Mongoose Object
    // We merge the AI data with specific logic (like externalApply)
    const newJob = new Job({
      ...aiData, // Spread all AI fields (title, skills, tools, etc.)
      
      postedBy: postedBy, // The ID of the user posting this
      externalApply: !!aiData.applyUrl, // True if AI found a URL
      requirementsText: text, // Save original text as backup
    });

    // 4. Save to DB
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully!",
      data: newJob
    });

  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: error.message });
  }
};
// Admin: create job
export const createJob = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.postedBy = req.user.id;

    payload.skills = Array.isArray(payload.skills)
      ? payload.skills.filter(Boolean)
      : [];

    payload.tools = Array.isArray(payload.tools)
      ? payload.tools.filter(Boolean)
      : [];

    payload.requirementsText =
      payload.requirementsText || payload.description || "";

    // Normalize branch/domain to lowercase for matching
    if (payload.branch) payload.branch = payload.branch.toLowerCase();
    if (payload.domain) payload.domain = payload.domain.toLowerCase();

    const job = await Job.create(payload);

    res.status(201).json({ msg: "Job created", job });
  } catch (err) {
    res.status(500).json({ error: "Job creation failed" });
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
