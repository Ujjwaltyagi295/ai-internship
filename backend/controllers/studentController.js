import path from "path";
import Student from "../models/studentModel.js";
import Job from "../models/jobModel.js";
import {
  callAiRecommender,
  toAiJobPayload,
  toAiStudentPayload,
  parseResumeWithAI,
} from "../utils/aiServiceClient.js";

// -------------------------------------
// Helpers
// -------------------------------------
const PROFILE_FIELDS = ["name", "branch", "cgpa", "batch"];

const buildProfileUpdates = (body = {}) =>
  PROFILE_FIELDS.reduce((acc, field) => {
    if (body[field] !== undefined) acc[field] = body[field];
    return acc;
  }, {});

const normalizeLower = (v) =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

const isEligibleForJob = (student = {}, job = {}) => {
  const studentCgpa = Number(student.cgpa) || 0;
  const studentBatch = normalizeLower(student.batch);
  const studentBranch = normalizeLower(student.branch);

  const jobBatches = Array.isArray(job.batchAllowed)
    ? job.batchAllowed.map(normalizeLower)
    : [];
  const allowedBranches = Array.isArray(job.allowedBranches)
    ? job.allowedBranches.map(normalizeLower)
    : [];

  if (job.minCgpa && studentCgpa < job.minCgpa) return false;
  if (jobBatches.length && !jobBatches.includes(studentBatch)) return false;
  if (allowedBranches.length && !allowedBranches.includes(studentBranch))
    return false;

  return true;
};

const ensureStudentId = (req, res) => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  return id;
};

// -------------------------------------
// Profile (self)
// -------------------------------------
export const getMyProfile = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch profile" });
  }
};

// -------------------------------------
// Profile CRUD
// -------------------------------------
export const getStudents = async (_req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch students" });
  }
};

export const createStudentProfile = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "University email is required" });

    const payload = buildProfileUpdates(req.body);
    payload.email = email;

    const student = await Student.findOneAndUpdate(
      { email },
      payload,
      { new: true, upsert: true }
    );

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Could not save student profile" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    const updates = buildProfileUpdates(req.body);

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Could not update profile" });
  }
};

// -------------------------------------
// Upload Resume + Save Parsed Data
// -------------------------------------
export const uploadResume = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    if (!req.file)
      return res.status(400).json({ message: "Resume file is required" });

    const resumeMeta = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storagePath: req.file.path
        ? path.relative(process.cwd(), req.file.path)
        : undefined,
      uploadedAt: new Date(),
    };

    const update = { resume: resumeMeta };

    try {
      const parsed = await parseResumeWithAI({
        filePath: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      });

      const extracted = parsed?.extracted || parsed?.parsed || {};

      update.resumeExtract = {
        skills: extracted.skills || [],
        projects: extracted.projects || [],
        tools: extracted.tools || [],
        experience: extracted.experience || [],
        education: extracted.education || [],
        summary:
          parsed?.raw_text?.replace(/\s+/g, " ").trim().slice(0, 250) || "",
      };

      if (Array.isArray(parsed?.embedding)) {
        update.skillEmbedding = parsed.embedding;
      }
    } catch (err) {
      console.warn("AI parse failed:", err.message);
    }

    const student = await Student.findByIdAndUpdate(studentId, update, {
      new: true,
    });

    res.json({ message: "Resume processed", student });
  } catch (err) {
    res.status(500).json({ message: "Could not upload resume" });
  }
};

// -------------------------------------
// AI Recommendations
// -------------------------------------
export const getStudentRecommendations = async (req, res) => {
  try {
    const { id: studentId } = req.user;
    const student = await Student.findById(studentId).lean();
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const jobs = await Job.find().lean();

    const eligibleJobs = jobs.filter((job) =>
      isEligibleForJob(student, job)
    );

    if (!eligibleJobs.length)
      return res.json({
        studentId,
        recommendations: [],
        count: 0,
        message: "No eligible jobs",
      });

    const aiResponse = await callAiRecommender({
      student,
      jobs: eligibleJobs,
    });

    const recs = (aiResponse.recommendations || []).map((r) => {
      const job = eligibleJobs.find(
        (j) => j._id.toString() === r.job_id
      );
      return {
        jobId: job?._id,
        title: job?.title,
        company: job?.company,
        jobType: job?.jobType,
        matchScore: Math.round(r.match_percent || 0),
        aiScore: r.score,
        reasons: r.reasons || [],
      };
    });

    res.json({
      studentId,
      recommendations: recs,
      count: recs.length,
      usedRanker: aiResponse.used_ranker || false,
      modelVersion: aiResponse.model_version || null,
    });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Failed to load recommendations" });
  }
};
