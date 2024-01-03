import { z } from "zod";

export const UpdateLayer = z.object({
  layerId: z.string({
    required_error: "Layer ID is required",
    invalid_type_error: "Layer ID is invalid",
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


