"use server";

import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreatePrinter } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { getAdmin } from "@/lib/admin"

const handler = async (data: InputType): Promise<ReturnType> => {
  const user = await getCurrentUser()

  if (!user || !user.id){
    return {
      error: "Unauthorized",
    };
  }

  const isAdmin = await getAdmin(user.id)

  if (!isAdmin) {
    return {
      error: "You need to be an admin to delete a printer.",
    };
  }

  let printer
  try {
    printer = await prisma.printer.create({
      data: {
        title: data.title,
        userId: data.userId,
        imageId: data.imageId,
        imageUrl: `https://utfs.io/f/${data.imageId}`,
      },
    });
    await createAuditLog({
      entityTitle: printer.id,
      entityId: printer.id,
      entityType: ENTITY_TYPE.PRINTER,
      action: ACTION.CREATE,
    })
  } catch (error) {
    return {
      error: "Failed to create."
    }
  }
  revalidatePath(`/dashboard/printers/${printer.id}`);
  return { data: printer };
};

export const createPrinter = createSafeAction(CreatePrinter, handler);
