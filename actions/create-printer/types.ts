import { z } from "zod";
import { Printer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreatePrinter } from "./schema";

export type InputType = z.infer<typeof CreatePrinter>;
export type ReturnType = ActionState<InputType, Printer>;
