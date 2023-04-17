import { Router } from "express";

import SubjectRouter from './subject';
import LessonRouter from './lesson';
import ContentRouter from './content'
import ExerciseRouter from './exercise';
import FeedbackRouter from './feedback';
import LoadDataRouter from './loadDoc'
const router = Router();



router.use('/api/subject', SubjectRouter);
router.use('/api/lesson', LessonRouter);
router.use('/api/content', ContentRouter);
router.use('/api/exercise', ExerciseRouter)
router.use('/api/feedback', FeedbackRouter)
router.use('/api/loadDoc', LoadDataRouter)

export default router