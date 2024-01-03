import { z } from "zod";
import { Cartridge } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateCartridgeLayers } from "./schema";

export type InputType = z.infer<typeof UpdateCartridgeLayers>;
export type ReturnType = ActionState<InputType, Cartridge>;
