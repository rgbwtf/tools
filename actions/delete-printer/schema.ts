import { z } from "zod";

export const DeletePrinter = z.object({
  printerId: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }),
});