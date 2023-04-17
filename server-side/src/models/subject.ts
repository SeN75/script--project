import { z } from "zod";
// subject
export const SubjectSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  level: z
    .number({
      required_error: "Level is required",
      invalid_type_error: "level meust be a number",
    })
    .min(0, "less value must be 0")
    .max(100, "max value must be 100"),
  status: z.boolean().default(false),
  id: z.string().uuid().optional(),
  language: z.string().default('javascript'),
});
export const SubjectUpdateDTOSchema = SubjectSchema.extend({
  title: z.string().optional(),
  level: z
    .number({
      required_error: "Level is required",
      invalid_type_error: "level meust be a number",
    })
    .min(0, "less value must be 0")
    .max(100, "max value must be 100")
    .optional(),
  status: z.boolean().default(false).optional(),
  id: z.string().uuid().optional(),
  language: z.string().default('javascript').optional()
});

export type Subject = z.infer<
  typeof SubjectSchema | typeof SubjectUpdateDTOSchema
>;


export type SubjectData = z.infer< typeof SubjectSchema>