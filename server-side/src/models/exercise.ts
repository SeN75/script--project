

import { z } from "zod";
//Exercise
export const ExerciseSchema = z.object({
    id: z.string().uuid().optional(),
    code: z.string({ required_error: "code is required" }),
    content_id: z.string({ required_error: "content_id is required" }).uuid(),
    point: z.number({ required_error: "point is required" }).min(0, 'must be greater than 0'),
    answers: z.any(),
    level: z.number().default(0).optional(),
    header: z.string().optional(),
    description: z.string().optional(),
  });
  export const ExerciseUpdateDTOSchema = ExerciseSchema.extend({
    id: z.string().uuid().optional(),
    code: z.string().optional(),
    content_id: z.string().uuid().optional(),
    point: z.number().min(0, 'must be greater than 0').optional(),
    answers: z.any().optional(),
    level: z.number().default(0).optional()
  });
  export type Exercise = z.infer<
    typeof ExerciseSchema | typeof ExerciseUpdateDTOSchema
  >;

