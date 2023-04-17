import { z } from "zod";
//feedback
export const FeedbackSchema = z.object({
    id: z.string().uuid().optional(),
    comment: z
      .string({ required_error: "Comment is required" })
      .max(5000, "must be less than 5000 characters"),
    user_id: z.string({ required_error: "user_id is required" }).uuid(),
    exercise_id: z.string({ required_error: "exercise_id is required" }).uuid(),
  });
  export const FeedbackUpdateDTOSchema = FeedbackSchema.extend({
    id: z.string().optional(),
    comment: z.string().max(5000, "must be less than 5000 characters").optional(),
    user_id: z.string().uuid().optional(),
    exercise_id: z.string().uuid().optional(),
  });
  export type Feedback = z.infer<
    typeof FeedbackSchema | typeof FeedbackUpdateDTOSchema
  >;