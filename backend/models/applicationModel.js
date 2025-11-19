import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['UNDER_REVIEW', 'SHORTLISTED', 'REJECTED'],
      default: 'UNDER_REVIEW',
    },
    matchScore: { type: Number, min: 0, max: 100 },
    missingSkills: [String],
    notes: String,
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
