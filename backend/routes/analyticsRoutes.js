import { Router } from 'express';
import { getSkillAnalytics, getMatchAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/skills', getSkillAnalytics);
router.get('/matches', getMatchAnalytics);

export default router;
