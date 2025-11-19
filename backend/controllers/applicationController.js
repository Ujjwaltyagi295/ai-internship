import Application from '../models/applicationModel.js';
import Student from '../models/studentModel.js';
import Job from '../models/jobModel.js';

export async function createApplication(req, res) {
  try {
    const studentId = req.user.id;  // fetched from token
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const [student, job] = await Promise.all([
      Student.findById(studentId),
      Job.findById(jobId),
    ]);

    if (!student || !job) {
      return res.status(404).json({ message: 'Student or job not found' });
    }

    const application = await Application.create({
      student: studentId,
      job: jobId,
      matchScore: req.body.matchScore || 0,
      missingSkills: req.body.missingSkills || [],
    });

    return res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Application already submitted' });
    }
    return res.status(500).json({ message: 'Could not submit application' });
  }
}

export async function getStudentApplications(req, res) {
  try {
    const studentId = req.user.id; // from token

    const applications = await Application.find({ student: studentId })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load student applications' });
  }
}

export async function getJobApplications(req, res) {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate('student')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load job applications' });
  }
}
