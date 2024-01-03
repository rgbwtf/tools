import { z } from "zod";
import { Printer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { DeletePrinter } from "./schema";

export type InputType = z.infer<typeof DeletePrinter>;
export type ReturnType = ActionState<InputType, Printer>;
