import path from "path";
import Student from "../models/studentModel.js";
import Job from "../models/jobModel.js";
import ParsedResume from "../models/parsedResume.js";
import jwt from "jsonwebtoken"
import fs from "fs";
import {
  callAiRecommender,
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

// Helper to get student ID from req.user (set by fetchuser middleware)
const ensureStudentId = (req, res) => {
  const id = req.user?.id;
  if (!id) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return id;
};

// -------------------------------------
// Profile (self) - Uses cookie auth
// -------------------------------------
export const getMyProfile = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    const student = await Student.findById(studentId).select("-password");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ error: "Could not fetch profile" });
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
    console.error("getStudents error:", err);
    res.status(500).json({ error: "Could not fetch students" });
  }
};

export const createStudentProfile = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "University email is required" });
    }

    const payload = buildProfileUpdates(req.body);
    payload.email = email;

    const student = await Student.findOneAndUpdate(
      { email },
      payload,
      { new: true, upsert: true }
    ).select("-password");

    res.status(201).json(student);
  } catch (err) {
    console.error("createStudentProfile error:", err);
    res.status(500).json({ error: "Could not save student profile" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    if (!studentId) return;

    const updates = buildProfileUpdates(req.body);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("updateStudentProfile error:", err);
    res.status(500).json({ error: "Could not update profile" });
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
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumeMeta = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storagePath: req.file.path ? path.relative(process.cwd(), req.file.path) : undefined,
      uploadedAt: new Date(),
    };

    // 1) Save resume metadata on Student
    const student = await Student.findByIdAndUpdate(
      studentId,
      { resume: resumeMeta },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
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

    // 4) Remove existing parsed resume for this student
    await ParsedResume.deleteOne({ student: studentId });

    // 5) Insert new parsed resume
    const createdParsedResume = await ParsedResume.create(parsedResumeDoc);

    // 6) Link parsed resume id back to student
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
    return res.status(500).json({ 
      error: "Could not upload resume", 
      details: err.message 
    });
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
      return res.status(404).json({ error: "Student not found" });
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

    // 2. Delete parsed resume from collection
    await ParsedResume.deleteOne({ student: studentId });

    // 3. Remove resume metadata and parsedResume pointer
    student.resume = undefined;
    student.parsedResume = undefined;
    await student.save();

    return res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("deleteResume error:", err);
    return res.status(500).json({ error: "Error deleting resume" });
  }
};


export const getMyResume = async (req, res) => {
  try {
    const studentId = req.user.id;

    const parsedResume = await ParsedResume.findOne({ student: studentId });

    if (!parsedResume) {
      return res.status(404).json({ message: "No parsed resume found for this student." });
    }

    res.status(200).json(parsedResume);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch resume data" });
  }
};


// -------------------------------------
// AI Recommendations
// -------------------------------------
export const getStudentRecommendations = async (req, res) => {
  try {
    const studentId = ensureStudentId(req, res);
    console.log("Student ID for recommendations:", studentId);
    if (!studentId) return;

    // 1) Fetch parsed resume for this student
    const parsed = await ParsedResume.findOne({ student: studentId })
      .select("resumeExtract skillEmbedding batch branch cgpa student")
      .lean();

    if (!parsed) {
      return res.status(404).json({
        message: "Parsed resume not found. Please upload and parse your resume first.",
      });
    }

    // 2) Fetch all jobs
    const jobs = await Job.find().lean();

    // 3) Use batch/branch/cgpa from parsed resume for eligibility
    const eligibleJobs = jobs.filter((job) =>
      isEligibleForJob(
        {
          cgpa: parsed.cgpa,
          batch: parsed.batch,
          branch: parsed.branch,
        },
        job
      )
    );
    if (!eligibleJobs.length) {
      return res.json({
        studentId,
        recommendations: [],
        count: 0,
        message: "No eligible jobs found",
      });
    }

    // 4) Build "student" payload for AI from parsed resume data
    const aiStudentPayload = {
      _id: studentId,
      cgpa: parsed.cgpa,
      batch: parsed.batch,
      branch: parsed.branch,
      resumeExtract: parsed.resumeExtract,
      skillEmbedding: parsed.skillEmbedding,
    };

    const aiResponse = await callAiRecommender({
      student: aiStudentPayload,
      jobs: eligibleJobs,
    });

    // 5) Map AI response back to job info
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

    return res.json({
      studentId,
      recommendations: recs,
      count: recs.length,
      usedRanker: aiResponse.used_ranker || false,
      modelVersion: aiResponse.model_version || null,
    });
  } catch (err) {
    console.error("Recommendation error:", err);
    return res.status(500).json({ message: "Failed to load recommendations" });
  }
};
