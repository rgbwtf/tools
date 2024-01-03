import { z } from "zod";
import { Layer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateLayer } from "./schema";

export type InputType = z.infer<typeof UpdateLayer>;
export type ReturnType = ActionState<InputType, Layer>;
