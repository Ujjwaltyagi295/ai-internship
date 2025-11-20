import { Router } from 'express';
import fetchuser from '../middleware/fetchuser.js';
import {
  createApplication,
  getStudentApplications,
  getJobApplications,
} from '../controllers/applicationController.js';

const router = Router();

// Require auth for creating application
router.post('/', fetchuser, createApplication);

// Student apps should use fetchuser instead of sending studentId manually
router.get('/student', fetchuser, getStudentApplications);

// Job applications (admin/recruiter area) – no studentId needed
router.get('/job/:jobId', getJobApplications);

export default router;