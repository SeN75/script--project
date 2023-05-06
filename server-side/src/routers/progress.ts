import e, { Request, Router } from "express";
import { supabase } from "../lib/supabase";
import { HttpStatusCode } from "../shared/http-status-code.enum";
import { Content } from "../models/content";
import { Exercise } from "../models/exercise";
import { User } from "../models/user";
const router = Router();
router.get("/", (req, res) => {
  return res.status(400).send();
});

router.get("/leaderboard", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("point, username")
    .order("point", { ascending: false })
    .order("created_at", { ascending: false });
  if (data) {
    data?.forEach((ele: any, i) => (ele.level = i + 1));

    return res.status(201).send(data);
  }

  return res.status(404).json({ message: "somthing happend wronge" });
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
router.get("/subject", async (req, res) => {
  const { query } = req;
  if (!query || !query["user_id"] || !query["subject_id"])
    return res.status(HttpStatusCode.BadRequest).json({
      message: "user_id or subject_id are missing",
      code: HttpStatusCode.BadRequest,
    });

  const data = await checkSubjectProggress({
    user_id: query["user_id"] as string,
    subject_id: query["subject_id"] as string,
  });
  if (data != null) return res.status(HttpStatusCode.Accepted).json(data);
  return res
    .status(HttpStatusCode.NotFound)
    .json({ message: "subject not found", code: HttpStatusCode.NotFound });
});

router.post("/", async (req, res) => {
  const { body } = req;
  // check if body exist
  console.log("body ==>", body);
  if (!body || !Object.keys(body).length)
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ message: "body is messing", code: HttpStatusCode.BadRequest });
  let user: User;
  const userReq = await supabase
    .from("profiles")
    .select()
    .eq("id", body["user_id"]);
  if (userReq.data && userReq.data[0]) user = userReq.data[0] as User;
  else
    return res
      .status(HttpStatusCode.NotFound)
      .json({ message: "user not found or user_id are messing" });
  // check if user aleardy solve this
  const check = await checkExerciseProggress({
    user_id: body["user_id"],
    exercise_id: body["exercise_id"],
  });

  if (check != null && check.isSolved)
    return res
      .status(HttpStatusCode.NotAcceptable)
      .json({ message: "user already solve this exercise", check });
  // get exercise
  console.log("before", body["exercise_id"]);
  const exericseReq = await supabase
    .from("Exercise")
    .select()
    .eq("id", body["exercise_id"]);
  // check if exercise exrt
  console.log("exericseReq ==> ", exericseReq);
  if (exericseReq.data != null && exericseReq.data.length) {
    const exercise: Exercise = exericseReq.data[0];
    exercise.answers =
      typeof exercise.answers == "string"
        ? exercise.answers.split(";")
        : exercise.answers;
    console.log("exercise ==> ", exercise);
    // compare between answers length
    if (exercise.answers.length && body["answers"].length) {
      let allMatch = true;
      console.log("1");
      for (let i = 0; i < exercise.answers.length; i++)
        if (exercise.answers[i] != body["answers"][i]) {
          allMatch = false;
          break;
        }
      // if not match send error message
      if (!allMatch)
        return res.status(400).json({
          message: "answer dose not match",
          code: 400,
          expcted:
            typeof exercise.answers == "string"
              ? exercise.answers.split(";")
              : exercise.answers,
          recived: body["answers"],
        });
      else {
        const newPoint = (exercise.point || 0) + user.point;
        const newProggres = await supabase.from("progress").insert([
          {
            user_id: user.id,
            exercise_id: exercise.id,
          },
        ]);
        if (newProggres.status == 201) {
          const uppdateReq = await supabase
            .from("profiles")
            .update({ point: newPoint })
            .eq("id", user.id)
            .select();

          if (uppdateReq.data)
            return res.status(HttpStatusCode.Accepted).json({
              message: "correct answer",
              code: HttpStatusCode.Accepted,
            });
          else
            return res
              .status(HttpStatusCode.NotAcceptable)
              .json({ message: "an error happend while update user point" });
        }
      }
      console.log("2");
    } else {
      return res.status(400).json({
        message: "answer length dose not match",
        code: 400,
        expcted:
          typeof exercise.answers == "string"
            ? exercise.answers.split(";")
            : exercise.answers,
        recived: body["answers"],
      });
    }
  } else {
    console.error("exercise error ==>", exericseReq);
  }
  return res
    .status(HttpStatusCode.NotAcceptable)
    .json({ message: "invalid inputs" });
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
    .eq("isDeleted", false)
    .neq("answers", "" || null)
    .eq("isActive", true)
    .eq("id", exercise_id);
  if (res.data && res.data[0]) {
    const { data, error } = await supabase
      .from("progress")
      .select()
      .eq("user_id", user_id)
      .eq("exercise_id", exercise_id);
    if (data && data[0]) {
      res.data[0].isSolved = true;
      res.data[0].isExercise =
        res.data[0].answers != "" && res.data[0].answers.split(";").length > 0;
      return res.data[0];
    } else if (!data?.length) return null;
    else if (!error) {
      res.data[0].isSolved = false;
      res.data[0].isExercise =
        res.data[0].answers != "" && res.data[0].answers.split(";").length > 0;
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
    .eq("isDeleted", false)
    .eq("isActive", true)
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
        execies.isExercise =
          execies.answers !== undefined &&
          execies.answers !== null &&
          execies.answers != "";
      } else {
        execies.isSolved = isExist.isSolved;
        execies.isExercise = isExist.isExercise;
      }
    }
    // console.log('exe pro => ', isE)
    let isSolved = true;
    for (let i = 0; i < content.exercises.length; i++)
      if (!content.exercises[i].isSolved && content.exercises[i].isExercise) {
        isSolved = false;
      }
    content.proggress = {};
    const exercises: any[] =
      content.exercises.filter((e: any) => e.isExercise) || [];
    content.proggress.isSolved = isSolved;
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
    for (let i = 0; i < (exercises.length || 0); i++)
      total_points += exercises[i].point || 0;

    for (let i = 0; i < (content.proggress.solved.length || 0); i++)
      total_solved_points += content.proggress.solved[i].point || 0;

    for (let i = 0; i < (content.proggress.remaining.length || 0); i++)
      total_remaining_points += content.proggress.remaining[i].point || 0;

    content.proggress.total_points = total_points;
    content.proggress.total_solved_points = total_solved_points;
    content.proggress.total_remaining_points = total_remaining_points;
    content.exercises;

    console.log("totoooo ", content);
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
    .eq("isDeleted", false)
    .eq("isActive", true)
    .eq("id", lesson_id);
  let proggress = [];
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
    proggress = proggress.filter((e) => e.total > 0);
    lesson.contents = proggress;
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
    console.log(proggress);
    for (let i = 0; i < proggress.length; i++) {
      if (isSolved && !proggress[i].isSolved) isSolved = false;
      lesson.proggress.total_solved += proggress[i].isSolved ? 1 : 0;
      lesson.proggress.total_remaining += !proggress[i].isSolved ? 1 : 0;
      lesson.proggress.total += proggress[i].total > 0 ? 1 : 0;
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

async function checkSubjectProggress({
  user_id,
  subject_id,
}: {
  user_id: string;
  subject_id: string;
}) {
  const { data, error } = await supabase
    .from("Subject")
    .select("id, level,title,lessons:Lesson(id)")
    .eq("isDeleted", false)
    .eq("isActive", true)
    .eq("id", subject_id);

  if (data) {
    const subject: any = data[0];
    let proggres = [];
    for (let i = 0; i < (subject.lessons.length || 0); i++) {
      let lesson = subject.lessons[i];
      const isExist = await checkLessonProggress({
        user_id,
        lesson_id: lesson.id,
      });

      if (isExist === undefined || isExist === null) {
        lesson = {
          isSolved: true,
          total_solved: 0,
          total_remaining: 0,
          total: 0,
          total_points: 0,
          total_solved_points: 0,
          total_remaining_points: 0,
          lesson_id: lesson.id,
        };
      } else {
        lesson = { ...isExist.proggress, lesson_id: lesson.id };
      }
      console.log("lesson log ==> ", lesson);
      proggres.push(lesson);
    }
    proggres = proggres.filter((e) => e.total > 0);
    subject.proggress = {
      lessons: proggres,
      isSolved: true,
      total_solved: 0,
      total_remaining: 0,
      total: proggres.length,
      total_points: 0,
      total_solved_points: 0,
      total_remaining_points: 0,
    };

    for (let i = 0; i < proggres.length; i++) {
      subject.proggress.total_points += proggres[i].total_points || 0;
      subject.proggress.total_solved_points +=
        proggres[i].total_solved_points || 0;
      subject.proggress.total_remaining_points +=
        proggres[i].total_remaining_points || 0;
    }

    subject.proggress.total_solved = proggres.filter(
      (ele) => ele.isSolved
    ).length;
    subject.proggress.total_remaining = proggres.filter(
      (ele) => !ele.isSolved
    ).length;
    subject.proggress.isSolved = subject.proggress.total_remaining.length == 0;
    delete subject.lessons;
    return subject;
  }
  return null;
}
export default router;
