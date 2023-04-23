import { Request, Router } from "express";
import { supabase } from "../lib/supabase";
import { HttpStatusCode } from "../shared/http-status-code.enum";
import { Content } from "../models/content";
import { Exercise } from "../models/exercise";

const router = Router();
router.get("/", (req, res) => {
  return res.status(400).send();
});

router.get("/exercise", async (req, res) => {
  const { query } = req;
  if (!query || !query["user_id"] || !query["exercise_id"])
    return res.status(HttpStatusCode.BadRequest).json({
      message: "user_id or exercise_id are missing",
      code: HttpStatusCode.BadRequest,
    });

  const data = await checkExerciseProggress({
    user_id: query["user_id"] as string,
    exercise_id: query["exercise_id"] as string,
  });
  console.log(data);
  if (data != null) return res.status(HttpStatusCode.Accepted).json(data);
  return res
    .status(HttpStatusCode.NotFound)
    .json({ message: "exercise not found", code: HttpStatusCode.NotFound });
});

router.get("/content", async (req, res) => {
  const { query } = req;
  if (!query || !query["user_id"] || !query["content_id"])
    return res.status(HttpStatusCode.BadRequest).json({
      message: "user_id or content_id are missing",
      code: HttpStatusCode.BadRequest,
    });

  const data = await checkContentProggress({
    user_id: query["user_id"] as string,
    content_id: query["content_id"] as string,
  });
  if (data != null) return res.status(HttpStatusCode.Accepted).json(data);
  return res
    .status(HttpStatusCode.NotFound)
    .json({ message: "exercise not found", code: HttpStatusCode.NotFound });
});

router.get("/lesson", async (req, res) => {
  const { query } = req;
  if (!query || !query["user_id"] || !query["lesson_id"])
    return res.status(HttpStatusCode.BadRequest).json({
      message: "user_id or lesson_id are missing",
      code: HttpStatusCode.BadRequest,
    });

  const data = await checkLessonProggress({
    user_id: query["user_id"] as string,
    lesson_id: query["lesson_id"] as string,
  });
  if (data != null) return res.status(HttpStatusCode.Accepted).json(data);
  return res
    .status(HttpStatusCode.NotFound)
    .json({ message: "lesson not found", code: HttpStatusCode.NotFound });
});

async function checkExerciseProggress({
  user_id,
  exercise_id,
}: {
  user_id: string;
  exercise_id: string;
}) {
  const res: any = await supabase
    .from("Exercise")
    .select("id, created_at, point, level, answers")
    .eq("id", exercise_id);
  if (res.data && res.data[0]) {
    const { data, error } = await supabase
      .from("progress")
      .select()
      .eq("user_id", user_id)
      .eq("exercise_id", exercise_id);
    if (data && data[0]) {
      res.data[0].isSolved = true;
      res.data[0].isExercise = res.data[0].answers.split(";").length > 0;
      return res.data[0];
    } else if (!error) {
      res.data[0].isSolved = false;
      res.data[0].isExercise = res.data[0].answers.split(";").length > 0;
      return res.data[0];
    }
  }

  return null;
}
async function checkContentProggress({
  user_id,
  content_id,
}: {
  user_id: string;
  content_id: string;
}) {
  const { data } = await supabase
    .from("Content")
    .select("id,level,exercises:Exercise(id,point,answers)")
    .eq("id", content_id);
  // console.log(data)
  if (data && data[0]) {
    const content: Content | any = data[0];
    for (let i = 0; i < (content.exercises?.length || 0); i++) {
      const execies = content.exercises![i];
      const isExist = await checkExerciseProggress({
        user_id,
        exercise_id: execies.id!,
      });
      if (isExist === undefined || isExist === null) {
        execies.isSolved = false;
        execies.isExercise = false;
      } else {
        execies.isSolved = isExist.isSolved;
        execies.isExercise = isExist.isExercise;
      }
    }
    content.proggress = {};
    const exercises: any[] =
      content.exercises.filter((e: any) => e.isExercise) || [];
    content.proggress.isSolved = exercises?.every((e: Exercise) => e.isSolved);
    content.proggress.remaining =
      exercises?.filter((e: Exercise) => e.isSolved == false) || [];
    content.proggress.solved =
      exercises?.filter((e: Exercise) => e.isSolved == true) || [];
    content.proggress.total_solved = content.proggress.solved.length || 0;
    content.proggress.total_remaining = content.proggress.remaining.length || 0;
    content.proggress.total = exercises.length || 0;
    let total_points = 0;
    let total_solved_points = 0;
    let total_remaining_points = 0;
    for (let i = 0; i < (content.exercises.length || 0); i++)
      total_points += content.exercises[i].point || 0;

    for (let i = 0; i < (content.proggress.solved || 0); i++)
      total_solved_points += content.proggress.solved[i].point || 0;

    for (let i = 0; i < (content.proggress.remaining.length || 0); i++)
      total_remaining_points += content.proggress.remaining[i].point || 0;

    content.proggress.total_points = total_points;
    content.proggress.total_solved_points = total_solved_points;
    content.proggress.total_remaining_points = total_remaining_points;
    delete content.exercises;
    return content;
  }
  return null;
}

async function checkLessonProggress({
  user_id,
  lesson_id,
}: {
  user_id: string;
  lesson_id: string;
}) {
  const { data, error } = await supabase
    .from("Lesson")
    .select("id, level,title,contents:Content(id)")
    .eq("id", lesson_id);
  const proggress = [];
  if (data && data[0]) {
    const lesson: any = data[0];
    for (let i = 0; i < (lesson.contents?.length || 0); i++) {
      let content = lesson.contents![i];
      const isExist = await checkContentProggress({
        user_id,
        content_id: content.id,
      });
      if (isExist === undefined || isExist === null) {
        content = {
          isSolved: true,
          total_solved: 0,
          total_remaining: 0,
          total: 0,
          total_points: 0,
          total_solved_points: 0,
          total_remaining_points: 0,
          content_id: content.id,
        };
      } else {
        delete isExist.proggress.remaining;
        delete isExist.proggress.solved;
        content = { ...isExist.proggress, content_id: content.id };
      }
      proggress.push(content);
    }
    delete lesson.contents;

    // lesson.contents = proggress;
    let isSolved = true;
    lesson.proggress = {
      isSolved: true,
      total_solved: 0,
      total_remaining: 0,
      total: 0,
      total_points: 0,
      total_solved_points: 0,
      total_remaining_points: 0,
    };
    for (let i = 0; i < proggress.length; i++) {
      if (isSolved && !proggress[i].isSolved) isSolved = false;
      lesson.proggress.total_solved += proggress[i].total_solved || 0;
      lesson.proggress.total_remaining += proggress[i].total_remaining || 0;
      lesson.proggress.total += proggress[i].total || 0;
      lesson.proggress.total_points += proggress[i].total_points || 0;
      lesson.proggress.total_solved_points +=
        proggress[i].total_solved_points || 0;
      lesson.proggress.total_remaining_points +=
        proggress[i].total_remaining_points || 0;
    }
    lesson.proggress.isSolved = isSolved;
    return lesson;
  }
  return null;
}
export default router;
