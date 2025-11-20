// models/studentModel.js
import mongoose from "mongoose";

const resumeExtractSchema = new mongoose.Schema(
  {
    skills: [mongoose.Schema.Types.Mixed],
    projects: [mongoose.Schema.Types.Mixed],
    experience: [mongoose.Schema.Types.Mixed],
    education: [mongoose.Schema.Types.Mixed],
    tools: [mongoose.Schema.Types.Mixed],
    summary: String,
  },
  { _id: false }
);

const preferenceSchema = new mongoose.Schema(
  {
    domains: [String],
    locations: [String],
    jobTypes: [String],
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },


    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    branch: { type: String, trim: true },
    cgpa: Number,
    batch: String,

    resume: {
      fileName: String,
      originalName: String,
      mimeType: String,
      size: Number,
      storagePath: String,
      uploadedAt: Date,
      cloudinaryUrl: String,
      cloudinaryPublicId: String,
    },

    resumeExtract: resumeExtractSchema,
    preferences: preferenceSchema,

    skillEmbedding: [Number],
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
