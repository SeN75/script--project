import { supabase } from "../lib/supabase";
import { Lesson, LessonSchema, LessonUpdateDTOSchema } from "../models/lesson";
import { HttpStatusCode } from "../shared/http-status-code.enum";
import { Request, Router } from "express";
const TABLE = "Lesson";
const router = Router();
// control handler

/**
 * @url /api/lesson
 * @description create lesson
 */
router.post("/", async (req, res) => {
  let body = req["body"] as Lesson;

  if (typeof body == "string") body = JSON.parse(body) as Lesson;
  // check if body exist or not
  if (!body || !Object.keys(body).length)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "there no fields to update",
      code: HttpStatusCode.BadRequest,
    });
  // check if body exist or not
  const check = LessonSchema.safeParse(body);
  if (!check.success)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "Invalid data",
      errors: check.error.formErrors.fieldErrors,
      code: HttpStatusCode.BadRequest,
    });
  const { data, error } = await supabase
    .from(TABLE)
    .insert<Lesson>([
      {
        title: body["title"],
        status: true,
        level: body["level"],
        subject_id: body["subject_id"],
      },
    ])
    .select();
  if (data) {
    const _data = data[0] as Lesson;
    return res.status(HttpStatusCode.Accepted).json(_data);
  }
  return res.status(HttpStatusCode.BadRequest).json({
    message: error["message"],
    code: HttpStatusCode.BadGateway,
  });
});
/**
 *
 * @param req
 * @param isActive
 * @param isDeleted
 * @returns
 */
async function getById(req: Request, isActive = true, isDeleted = false) {
  const param = req["query"];
  // chech if record id exist or not
  if (!param || !param["id"]) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select()
    .eq("isDeleted", isDeleted)
    .eq("isActive", isActive)
    .eq("id", param["id"]);

  if (data && data[0]) return data[0] as Lesson;
  return null;
}
/**
 * @url /api/lesson
 * @description get all lesson
 *
 * @url /api/lesson?id=
 * @description get lesson by id
 */
router.get("/", async (req, res) => {
  const param = req["query"];
  if (param && param["id"]) {
    const data = await getById(req);
    if (data) return res.status(HttpStatusCode.Ok).json(data);
    else
      return res.status(HttpStatusCode.NotFound).json({
        message: "[FAILED] user not found or not exist",
        code: HttpStatusCode.NotFound,
      });
  } else {
    const select = param["content"]
      ? "id, title, subject_id, Content( id,title, description,subdescription, subtitle)"
      : "id, title, subject_id";
    let request = supabase
      .from(TABLE)
      .select(select)
      .eq("isActive", true)
      .eq("isDeleted", false);
    if (param["subject_id"])
      request = request.eq("subject_id", param["subject_id"]);
    const { data, error } = await request;
    if (data) return res.status(HttpStatusCode.Ok).json(data as Lesson[]);
    else
      return res
        .status(HttpStatusCode.NotFound)
        .json({ message: error["message"], code: HttpStatusCode.NotFound });
  }
});
/**
 * @url /api/lesson?id=LESSON_ID
 * @description update lesson data
 */
router.put("/", async (req, res) => {
  let body = req["body"];
  const param = req["query"];
  if (typeof body == "string") body = JSON.parse(body) as Lesson;
  // check if body exist or not
  if (!body || !Object.keys(body).length)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "[FAILED] there no fields to update",
      code: HttpStatusCode.BadRequest,
    });
  // chech if record id exist or not
  if (!param || !param["id"])
    return res.status(HttpStatusCode.NotFound).json({
      message: "[FAILED] id param is messing",
      code: HttpStatusCode.NotFound,
    });
  const check = LessonUpdateDTOSchema.safeParse(body);
  if (!check.success)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "Invalid data",
      errors: check.error.formErrors.fieldErrors,
      code: HttpStatusCode.BadRequest,
    });
  const { data, error } = await supabase
    .from(TABLE)
    .update(body)
    .eq("id", param["id"])
    .select();
  if (data) return res.status(HttpStatusCode.Accepted).json(data[0]);
  if (error)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "[FAILED] somthing wrong happend",
      code: HttpStatusCode.BadRequest,
    });
  return res.status(HttpStatusCode.NotFound).json({ message: "not found" });
});
/**
 * @url /api/lesson?id=LESSON_ID
 * @description delete lesson
 */
router.delete("/", async (req, res) => {
  const body = await getById(req, true, false);
  if (!body)
    return res
      .status(HttpStatusCode.NotFound)
      .json({ message: "[FAILED] delete failed, lesson not found" });
  const { data, error } = await supabase
    .from(TABLE)
    .update({ isDeleted: true })
    .eq("id", req.query.id)
    .select();
  if (data)
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: "[SUCCESS] Lesson deleted successfully" });
  return res.status(HttpStatusCode.BadRequest).json({
    message: "[FAILED] somthing wrong happend while deleting lesson",
  });
});

export default router;