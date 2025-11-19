import path from "path";
import Student from "../models/studentModel.js";
import Job from "../models/jobModel.js";
import ParsedResume from "../models/parsedResume.js";
import fs from "fs";
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

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeMeta = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storagePath: req.file.path ? path.relative(process.cwd(), req.file.path) : undefined,
      uploadedAt: new Date(),
    };

    // 1) Save resume metadata on Student (overwrite previous resume meta)
    const student = await Student.findByIdAndUpdate(
      studentId,
      { resume: resumeMeta },
      { new: true }
    );

    // If student not found (extra check)
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2) Attempt AI parsing
    let parsed = null;
    try {
      parsed = await parseResumeWithAI({
        filePath: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      });
    } catch (err) {
      console.warn("AI parse failed:", err?.message || err);
      // We deliberately don't delete existing parsed resume if parse fails.
      return res.json({
        message: "Resume uploaded, but parsing failed. Resume metadata saved.",
        student,
      });
    }

    // 3) Build parsed resume document
    const extracted = parsed?.extracted || parsed?.parsed || {};
    const parsedResumeDoc = {
      student: studentId,
      resumeMeta,
      resumeExtract: {
        skills: extracted.skills || [],
        projects: extracted.projects || [],
        tools: extracted.tools || [],
        experience: extracted.experience || [],
        education: extracted.education || [],
        summary: parsed?.raw_text?.replace(/\s+/g, " ").trim().slice(0, 250) || "",
        rawText: parsed?.raw_text || "",
      },
      skillEmbedding: Array.isArray(parsed?.embedding) ? parsed.embedding : [],
      parsedAt: new Date(),
      parserInfo: {
        engine: parsed?.engineName || "unknown",
        version: parsed?.engineVersion || "unknown",
      },
    };

    // 4) Remove any existing parsed resume for this student
    // Use deleteOne to remove existing doc (if any)
    await ParsedResume.deleteOne({ student: studentId });

    // 5) Insert new parsed resume
    const createdParsedResume = await ParsedResume.create(parsedResumeDoc);

    // 6) Optionally link parsed resume id back to student (useful pointer)
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { parsedResume: createdParsedResume._id },
      { new: true }
    );

    return res.json({
      message: "Resume processed and parsed data saved.",
      student: updatedStudent,
      parsedResume: createdParsedResume,
    });
  } catch (err) {
    console.error("uploadResume error:", err);
    return res.status(500).json({ message: "Could not upload resume", error: err.message });
  }
};

// -------------------------------------
// Resume Delete
// -------------------------------------
export const deleteResume = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1. Delete resume file from disk if exists
    if (student.resume?.storagePath) {
      const filePath = path.join(process.cwd(), student.resume.storagePath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("Could not delete file:", err.message);
        }
      }
    }

    // 2. Delete parsed resume from separate collection
    await ParsedResume.deleteOne({ student: studentId });

    // 3. Remove resume metadata and parsedResume pointer
    student.resume = undefined;
    student.parsedResume = undefined;
    await student.save();

    return res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("deleteResume error:", err);
    return res.status(500).json({ message: "Error deleting resume" });
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
