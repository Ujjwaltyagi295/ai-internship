import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';

const allowedStatuses = ['UNDER_REVIEW', 'SHORTLISTED', 'REJECTED'];

export async function getAdminOverview(_req, res) {
  try {
    const [totalJobs, totalApplications, pendingApplications] = await Promise.all([
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'UNDER_REVIEW' }),
    ]);

    res.json({
      totalJobs,
      totalApplications,
      pendingApplications,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin overview' });
  }
}

export async function getApplicantsForJob(req, res) {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId })
      .populate('student')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch applicants' });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Could not update application status' });
  }
}

export function exportApplicantsList(_req, res) {
  res.json({ message: 'Export to CSV/PDF will be available soon' });
}
