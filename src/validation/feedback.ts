import { z } from "zod";

export const FeedbackSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  supplierId: z.string().min(1, "Supplier ID is required"),
  comment: z.string().min(1, "Comment is required"),
  feedbackDate: z.date().min(new Date(0), "Feedback date is required"),
});

export type FeedbackFormData = z.infer<typeof FeedbackSchema>;
