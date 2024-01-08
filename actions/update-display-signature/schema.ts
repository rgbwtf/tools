import { z } from "zod";

export const UpdateDisplaySignature = z.object({
  printerId: z.string({
    required_error: "Layer ID is required",
    invalid_type_error: "Layer ID is invalid",
  }),
  displaySignature: z.boolean({
    required_error: "Display signature is required",
    invalid_type_error: "Display signature is invalid",
  }),
});


