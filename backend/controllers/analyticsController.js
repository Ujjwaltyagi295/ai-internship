import Job from '../models/jobModel.js';
import Student from '../models/studentModel.js';
import Application from '../models/applicationModel.js';

export async function getSkillAnalytics(_req, res) {
  try {
    const jobs = await Job.find({}, 'skillsRequired');

    const skillCounts = jobs.reduce((acc, job) => {
      (job.skillsRequired || []).forEach((skill) => {
        if (!skill) {
          return;
        }
        const key = skill.toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});

    res.json({ skills: skillCounts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load skill analytics' });
  }
}

export async function getMatchAnalytics(_req, res) {
  try {
    const [students, jobs, applications] = await Promise.all([
      Student.countDocuments(),
      Job.countDocuments(),
      Application.find({}, 'matchScore status'),
    ]);

    const totalScore = applications.reduce((sum, application) => sum + (application.matchScore || 0), 0);
    const averageScore = applications.length ? Math.round(totalScore / applications.length) : 0;

    res.json({
      students,
      jobs,
      applications: applications.length,
      averageScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load match analytics' });
  }
}
