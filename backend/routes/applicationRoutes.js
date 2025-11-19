import { Router } from 'express';
import {
  createApplication,
  getStudentApplications,
  getJobApplications,
} from '../controllers/applicationController.js';

const router = Router();

router.post('/', createApplication);
router.get('/student/:studentId', getStudentApplications);
router.get('/job/:jobId', getJobApplications);

export default router;
