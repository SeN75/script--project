import { Router } from "express";

import SubjectRouter from './subject';
import LessonRouter from './lesson';
const router = Router();



router.use('/api/subject', SubjectRouter);
router.use('/api/lesson', LessonRouter);

export default router