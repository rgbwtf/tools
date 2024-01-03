import { z } from "zod";

const dataSchema = z.object({
  key: z.string(),
  url: z.string(),
  name: z.string(),
  size: z.number(),
}).nullable();

const errorsSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.any(),
}).nullable();

const colorObjectSchema = z.object({
  data: dataSchema,
  error: errorsSchema,
})

const colorArraySchema = z.array(colorObjectSchema).max(256);

export const UpdateCartridgeLayers = z.object({
  printerId: z.string({
    required_error: "Printer ID is required",
    invalid_type_error: "Printer ID is invalid",
  }),
  data: z.object({
    red: colorArraySchema,
    green: colorArraySchema,
    blue: colorArraySchema,
  }),
})


