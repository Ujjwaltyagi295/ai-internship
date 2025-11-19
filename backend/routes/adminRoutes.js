import { Router } from 'express';
import {
  getAdminOverview,
  getApplicantsForJob,
  updateApplicationStatus,
  exportApplicantsList,
} from '../controllers/adminController.js';

const router = Router();

router.get('/overview', getAdminOverview);
router.get('/jobs/:jobId/applicants', getApplicantsForJob);
router.patch('/applications/:applicationId/status', updateApplicationStatus);
router.get('/export', exportApplicantsList);

export default router;
