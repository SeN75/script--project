import { Request, Router } from "express";
import { supabase } from "../lib/supabase";
import { HttpStatusCode } from "../shared/http-status-code.enum";
import { Subject, SubjectSchema, SubjectUpdateDTOSchema } from "../models/subject";
const TABLE = "Subject";

const router = Router();
/**
 * @url /api/subject
 * @description get all subject
 *
 * @url /api/subject?id=
 * @description get subject by id
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
    const select = param["lesson"]
      ? `title, id, level, language, Lesson(title, id, level)`
      : "title, id, level, language";
    const limit = param && param["limit"] ? +param["limit"] : 50;
    let request = supabase
      .from(TABLE)
      .select(select)
      .eq("isActive", true)
      .eq("isDeleted", false)
      .limit(limit);
    if (param["langauge"]) request = request.eq("language", param["language"]);
    if(param["lesson"]) request = request.eq('Lesson.isDeleted', false)
    const { data, error } = await request.order('level');
    console.log("dafdafd ==> ", error);

    if (data) return res.status(HttpStatusCode.Ok).json(data as Subject[]);
    else
      return res
        .status(HttpStatusCode.NotFound)
        .json({ message: error!["message"], code: HttpStatusCode.NotFound });
  }
});
async function getById(
  req: Request,
  isActive = true,
  isDeleted = false
) {
  const param = req["query"];
  // chech if record id exist or not
  if (!param || !param["id"]) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select()
    .eq("isDeleted", isDeleted)
    .eq("isActive", isActive)
    .eq("id", param["id"]);

  if (data && data[0]) return data[0] as Subject;
  return null;
}


/**
 * @url /api/subject
 * @description create subject
 */
router.post('/', async (req, res) => {
  let body = req["body"] as Subject ;
  if( typeof body == 'string')
    body = JSON.parse(body as string) as Subject;
  // check if body exist or not
  const check = SubjectSchema.safeParse(body);
  if (!check.success)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "Invalid data",
      errors: check.error.formErrors.fieldErrors,
      code: HttpStatusCode.BadRequest,
    });
  const { data, error } = await supabase
    .from(TABLE)
    .insert<Subject>([
      {
        title: body["title"],
        status: true,
        level: body["level"],
        language: body["language"],
      },
    ])
    .select();
  if (data) {
    const _data = data[0] as Subject;
    return res.status(HttpStatusCode.Accepted).json(_data);
  }
  return res.status(HttpStatusCode.BadRequest).json({
    message: error["message"],
    code: HttpStatusCode.BadGateway,
  });
})



/**
 * @url /api/subject?id=SUBJECT_ID
 * @description update subject data
 */
router.patch('/', async (req, res) =>{
  const param = req["query"];
  let body = req["body"] as Subject ;
  if( typeof body == 'string')
    body = JSON.parse(body as string) as Subject;
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
  const check = SubjectUpdateDTOSchema.safeParse(body);
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
      code: HttpStatusCode.BadGateway,
    });
  return res.status(HttpStatusCode.NotFound).json({ message: "not found" });
});
/**
 * @url /api/subject?id=SUBJECT_ID
 * @description delete subject
 */
router.delete('/', async (req, res) => {
  const body = await getById(req, true, false);
  if (!body)
    return res
      .status(HttpStatusCode.NotFound)
      .json({ message: "[FAILED] delete failed, subject not found" });
  const { data, error } = await supabase
    .from(TABLE)
    .update({ isDeleted: true })
    .eq("id", req.query.id)
    .select();
  if (data)
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: "[SUCCESS] Subject deleted successfully" });
  return res.status(HttpStatusCode.BadRequest).json({
    message: "[FAILED] somthing wrong happend while deleting subject",
  });
})
export default router;



