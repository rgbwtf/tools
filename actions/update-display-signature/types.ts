import { z } from "zod";
import { Printer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateDisplaySignature } from "./schema";

export type InputType = z.infer<typeof UpdateDisplaySignature>;
export type ReturnType = ActionState<InputType, Printer>;
