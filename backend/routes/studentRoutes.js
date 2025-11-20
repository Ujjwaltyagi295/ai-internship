import { Router } from 'express';
import {
  createStudentProfile,
  getStudents,
  getMyProfile,
  updateStudentProfile,
  uploadResume,
  getStudentRecommendations,
  deleteResume,
  getMyResume,
} from '../controllers/studentController.js';
import fetchuser from '../middleware/fetchuser.js';
import { resumeUpload } from '../middleware/resumeUpload.js';

const router = Router();

router.get('/', getStudents);
router.post('/', createStudentProfile);

router.get('/me', fetchuser, getMyProfile);

router.get('/me/resume', fetchuser, getMyResume);
router.patch('/me', fetchuser, updateStudentProfile);
router.post('/me/resume', fetchuser, resumeUpload.single('resume'), uploadResume);
router.post('/me/resumedelete', fetchuser, deleteResume)

router.get('/me/recommendations', fetchuser, getStudentRecommendations);

export default router;
