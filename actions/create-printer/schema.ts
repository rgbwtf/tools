import { z } from "zod";

export const CreatePrinter = z.object({
  userId: z.string({
    required_error: "Creator is required",
    invalid_type_error: "User is invalid",
  }),
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  }),
  imageId: z.string({
    required_error: "Image ID is required",
    invalid_type_error: "Image ID is invalid",
  }),
  imageUrl: z.string({
    required_error: "Image URL is required",
    invalid_type_error: "Image URL is invalid",
  }),
});