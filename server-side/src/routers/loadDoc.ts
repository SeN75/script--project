import { Request, Response, Router } from "express";
import { supabase } from "../lib/supabase";
import { HttpStatusCode } from "../shared/http-status-code.enum";

const router = Router();
router.get("/", (req: Request, res: Response<any>) => {
  const { query } = req;
  if (query["load"] == "getSubjectWithLessonByLangauge")
    return getSubjectWithLessonByLangauge(req, res);
  else if (query["load"] == "getPageContentByLessonId")
    return getPageContentByLessonId(req, res);
  return res.status(HttpStatusCode.NotFound);
});

// /api/loadData?load=subjectWithLessonByLanguage&language=javascript

async function getSubjectWithLessonByLangauge(
  req: Request,
  res: Response<any>
) {
  const { query } = req;
  let request = supabase
    .from("Subject")
    .select("title,id,level, Lesson(title,id, level)")
    .eq("isActive", true)
    .eq("isDeleted", false);

  if (query["language"]) request = request.eq("language", query["language"]);
  const { data, error } = await request;

  if (data) return res.status(HttpStatusCode.Accepted).json(data);
  return res.status(HttpStatusCode.NotFound).json(error);
}

async function getPageContentByLessonId(req: Request, res: Response<any>) {
  const { query } = req;

  let request = supabase
    .from("Lesson")
    .select("title,id,level, isDeleted, Content(*, Exercise(*))")
    .eq("isActive", true)
    .eq("isDeleted", false)
    .eq("id", query["lessonId"]);

  const { data, error } = await request;

  if (data) {
    data.map((lesson) => {
      return lesson?.Content?.map((content: any) => {
        return content.Exercise.map((e: any) => {
          e["answers"] = e["answers"].split(";");
          return e;
        });
      });
    });

    return res.status(HttpStatusCode.Accepted).json(data);
  }
  return res.status(HttpStatusCode.NotFound).json(error);
}

export default router;