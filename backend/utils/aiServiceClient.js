// Lightweight client to call the Python AI recommender service

import fs from "fs/promises";
import axios from "axios";
import FormData from "form-data";

const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || "http://localhost:8000").replace(/\/+$/, "");
const RECOMMEND_ENDPOINT = `${AI_SERVICE_URL}/recommend`;
const PARSE_ENDPOINT = `${AI_SERVICE_URL}/parse_resume`;

// ---------------------------------------------------------
// SAFE ID
// ---------------------------------------------------------
const safeId = (value, prefix) => {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value.toString === "function") return value.toString();
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
};

// ---------------------------------------------------------
// EXTRACT STUDENT SKILLS CORRECTLY
// (Do NOT let Node normalize. Let Python normalize instead.)
// ---------------------------------------------------------
const extractSkillsFromStudent = (student = {}) => {
  const extract = student.resumeExtract || {};

  const rawSources = [
    ...(extract.skills || []),      // preferred
    ...(extract.rawSkills || []),   // legacy
    ...(student.skills || []),
  ];

  return Array.from(
    new Set(
      rawSources
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean)
    )
  );
};

// Normalize domains to a lowercase list so the Python service receives a consistent shape.
const normalizeDomains = (job = {}) => {
  const raw = [];

  if (Array.isArray(job.domains)) raw.push(...job.domains);
  if (typeof job.domain === "string") raw.push(job.domain);

  const cleaned = raw
    .map((d) => (typeof d === "string" ? d.trim().toLowerCase() : ""))
    .filter(Boolean);

  return Array.from(new Set(cleaned));
};

// ---------------------------------------------------------
// STUDENT PAYLOAD → SENT TO AI SERVICE
// ---------------------------------------------------------
export const toAiStudentPayload = (student = {}) => {
  const extract = student.resumeExtract || {};

  const skills = extractSkillsFromStudent(student);
  const skillEmbedding = Array.isArray(student.skillEmbedding)
    ? student.skillEmbedding
    : Array.isArray(student.skill_embedding)
    ? student.skill_embedding
    : [];
  const domains =
    (Array.isArray(extract.domains) && extract.domains.length
      ? extract.domains
      : []) ||
    (Array.isArray(student.domains) && student.domains.length
      ? student.domains
      : []) ||
    (Array.isArray(student.preferences?.domains)
      ? student.preferences.domains
      : []);
  const experience =
    Array.isArray(extract.experience) ? extract.experience : [];
  const education =
    Array.isArray(extract.education) ? extract.education : [];
  const projects =
    Array.isArray(extract.projects) ? extract.projects : [];
  const positions = Array.isArray(extract.experience)
    ? extract.experience
        .map((e) =>
          typeof e === "object"
            ? e?.title || e?.role || e?.position
            : null
        )
        .filter(Boolean)
    : [];
  const responsibilitiesText = Array.isArray(extract.experience)
    ? extract.experience
        .map((e) => (typeof e === "object" ? e?.description || "" : ""))
        .filter(Boolean)
        .join(" ")
    : "";

  // Prefer full raw resume text captured during upload; fallback to stitched sections.
  const resumeText =
    (typeof extract.rawText === "string" && extract.rawText.trim())
      ? extract.rawText.trim()
      : [
          extract.summary || "",
          ...(extract.experience || []).map((e) =>
            typeof e === "string" ? e : e?.description || ""
          ),
          ...(extract.projects || extract.rawProjects || []).map((p) =>
            typeof p === "string" ? p : p?.title || ""
          ),
        ]
          .filter(Boolean)
          .join("\n")
          .trim() || extract.summary || "No resume text";

  return {
    id: safeId(student._id || student.id, "student"),

    resume_text: resumeText,
    skills,                      // ✔ raw skills
    skillEmbedding,              // optional: reuse precomputed embedding when available
    branch: student.branch || null,
    domains,
    gpa: student.cgpa || 0,
    experience,
    education,
    projects,
    positions,
    responsibilities: responsibilitiesText,
  };
};

// ---------------------------------------------------------
// JOB PAYLOAD → SENT TO AI SERVICE
// ---------------------------------------------------------
export const toAiJobPayload = (job = {}) => {
  const domains = normalizeDomains(job);

  const skillsRequired = Array.isArray(job.skillsRequired)
    ? job.skillsRequired
    : Array.isArray(job.skills)
    ? job.skills
    : [];

  return {
    id: safeId(job._id || job.id, "job"),

    title: job.title || "",
    description: job.description || job.requirementsText || "",

    skills: Array.isArray(job.skills) ? job.skills.map((s) => s.trim()) : [],
    skills_required: skillsRequired.map((s) => (typeof s === "string" ? s.trim() : s)),
    related_skills_in_job: Array.isArray(job.relatedSkills) ? job.relatedSkills : [],
    tools: Array.isArray(job.tools) ? job.tools.map((t) => t.trim()) : [],

    company: job.company || "",

    branch: job.branch
      ? typeof job.branch === "string"
        ? job.branch.toLowerCase().trim()
        : job.branch
      : null,
    domain: job.domain || null,   // legacy single value
    domains,                      // normalized list for FeatureBuilder
    education_requirement: job.educationRequirement || "",
    experience_requirement: job.experienceRequirement || job.requirementsText || "",
    responsibilities_text: job.responsibilitiesText || job.description || "",
  };
};

// ---------------------------------------------------------
// CALL PYTHON AI RANKER
// ---------------------------------------------------------
export const callAiRecommender = async ({ student, jobs }) => {
  const payload = {
    student: toAiStudentPayload(student),
    jobs: jobs.map(toAiJobPayload),
  };

  const res = await axios.post(RECOMMEND_ENDPOINT, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

// ---------------------------------------------------------
// PARSE RESUME VIA AI SERVICE
// ---------------------------------------------------------
export const parseResumeWithAI = async ({ filePath, originalName, mimeType }) => {
  const buffer = await fs.readFile(filePath);
  const form = new FormData();

  form.append("file", buffer, {
    filename: originalName || "resume.pdf",
    contentType: mimeType || "application/pdf",
  });

  const res = await axios.post(PARSE_ENDPOINT, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return res.data;
};
