import { Router } from 'express';
import fetchuser from '../middleware/fetchuser.js';
import {
  createApplication,
  getStudentApplications,
  getJobApplications,
} from '../controllers/applicationController.js';
import restrictRole from '../middleware/restrictRole.js';

const router = Router();

// Require auth for creating application
router.post('/', fetchuser, createApplication);

// Student apps should use fetchuser instead of sending studentId manually
router.get('/student', fetchuser, getStudentApplications);

// Job applications (admin/recruiter area)
router.get('/job/:jobId', fetchuser, restrictRole("admin"), getJobApplications);

export default router;
