import Application from '../models/applicationModel.js';
import Student from '../models/studentModel.js';
import Job from '../models/jobModel.js';

export async function createApplication(req, res) {
  try {
    const { studentId, jobId } = req.body;

    if (!studentId || !jobId) {
      return res.status(400).json({ message: 'Student ID and Job ID are required' });
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

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Application already submitted' });
    }
    res.status(500).json({ message: 'Could not submit application' });
  }
}

export async function getStudentApplications(req, res) {
  try {
    const applications = await Application.find({ student: req.params.studentId })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load student applications' });
  }
}

export async function getJobApplications(req, res) {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('student')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load job applications' });
  }
}
