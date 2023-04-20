import { Request, Router } from "express";
import {
  Content,
  ContentSchema,
  ContentUpdateDTOSchema,
} from "../models/content";
import { HttpStatusCode } from "../shared/http-status-code.enum";
import { supabase } from "../lib/supabase";

const router = Router();
const TABLE = "Content";
// control handler

/**
 * @url /api/content
 * @description create content
 */
router.post("/", async (req, res) => {
  let body = req["body"] as Content;
  if (typeof body == "string") body = JSON.parse(body) as Content;
  // check if body exist or not
  if (!body || !Object.keys(body).length)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "there no fields to update",
      code: HttpStatusCode.BadRequest,
    });
  const check = ContentSchema.safeParse(body);
  if (!check.success)
    return res.status(HttpStatusCode.BadRequest).json({
      message: "Invalid data",
      errors: check.error.formErrors.fieldErrors,
      code: HttpStatusCode.BadRequest,
    });
  const { data, error } = await supabase
    .from(TABLE)
    .insert<Content>([
      {
        title: body["title"],
        lesson_id: body["lesson_id"],
        description: body["description"],
        subdescription: body["subdescription"],
        subtitle: body["subtitle"],
      },
    ])
    .select();
  if (data) {
    const _data = data[0] as Content;
    return res.status(HttpStatusCode.Accepted).json(_data);
  }
  return res.status(HttpStatusCode.BadRequest).json({
    message: error["message"],
    code: HttpStatusCode.BadRequest,
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

  if (data && data[0]) return data[0] as Content;
  return null;
}
/**
 * @url /api/content
 * @description get all content
 *
 * @url /api/content?id=
 * @description get content by id
 */

router.get("/", async (req, res) => {
  const param = req["query"];
  if (param && param["id"]) {
    const data = await getById(req);
    if (data) return res.status(HttpStatusCode.Ok).json(data);
    else
      return res.status(HttpStatusCode.NotFound).json({
        message: "content - not found or not exist",
        code: HttpStatusCode.NotFound,
      });
  } else {
    const select = param['exercise'] ?  
    'id,title, description,subdescription, subtitle, lesson_id, Exercise(*)'
    :
    "id,title, description,subdescription, subtitle, lesson_id";
    let request = supabase
      .from(TABLE)
      .select(select)
      .eq("isActive", true)
      .eq("isDeleted", false);
    if (param["lesson_id"])
      request = request.eq("lesson_id", param["lesson_id"]);
    
    const { data, error } = await request;
    if (data) return res.status(HttpStatusCode.Ok).json(data as Content[]);
    else
      return res
        .status(HttpStatusCode.NotFound)
        .json({ message: error["message"], code: HttpStatusCode.NotFound });
  }
});

/**
 * @url /api/content?id=LESSON_ID
 * @description update content data
 */
router.put("/", async (req, res) => {
  let body = req["body"];
  const param = req["query"];
  if (typeof body == "string") body = JSON.parse(body) as Content;

  console.log("content update body ==> ", body);
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
  const check = ContentUpdateDTOSchema.safeParse(body);
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
      error: error,
    });
  return res.status(HttpStatusCode.NotFound).json({ message: "not found" });
});
/**
 * @url /api/content?id=LESSON_ID
 * @description delete content
 */

router.delete("/", async (req, res) => {
  const body = await getById(req, true, false);
  if (!body)
    return res
      .status(HttpStatusCode.NotFound)
      .json({ message: "[FAILED] delete failed, content not found" });
  const { data, error } = await supabase
    .from(TABLE)
    .update({ isDeleted: true })
    .eq("id", req.query.id)
    .select();
  if (data)
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: "[SUCCESS] Content deleted successfully" });
  return res.status(HttpStatusCode.BadRequest).json({
    message: "[FAILED] somthing wrong happend while deleting content",
  });
});

export default router;