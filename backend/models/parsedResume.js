import mongoose from "mongoose";

const ParsedResumeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
      unique: true, // ensure one parsedResume per student
    },
    resumeMeta: {
      fileName: String,
      originalName: String,
      mimeType: String,
      size: Number,
      storagePath: String,
      uploadedAt: Date,
    },
    resumeExtract: {
      skills: { type: [String], default: [] },
      projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
      tools: { type: [String], default: [] },
      experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
      education: { type: [mongoose.Schema.Types.Mixed], default: [] },
      summary: { type: String, default: "" },
      rawText: { type: String, default: "" },
    },
    branch: { type: String, trim: true },
    cgpa: { type: Number, default: 0 },
    batch: { type: String, trim: true },
    skillEmbedding: { type: [Number], default: [] },
    parsedAt: { type: Date, default: Date.now },
    parserInfo: {
      // optional: store which AI, version, errors, etc
      engine: String,
      version: String,
      error: String,
    },
  },
  { timestamps: true }
);

const ParsedResume = mongoose.model("ParsedResume", ParsedResumeSchema);
export default ParsedResume;
