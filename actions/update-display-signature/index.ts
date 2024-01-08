"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateDisplaySignature } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { getCurrentUser } from "@/lib/session"
import { getAdmin } from "@/lib/admin"

const handler = async (data: InputType): Promise<ReturnType> => {
  const user = await getCurrentUser()

  if (!user || !user.id) throw new Error('Unauthorized')

  const isAdmin = await getAdmin(user.id)

  if (!isAdmin) throw new Error('Unauthorized')

  const existingPrinter = await prisma.printer.findUnique({
    where: { id: data.printerId }
  });
  
  if (!existingPrinter) throw new Error('Printer not found');

  let printer
  try {
    // Create a new cartridge for the printerId
    printer = await prisma.printer.update({
      where: { id: data.printerId },
      data: {
        displaySignature: data.displaySignature,
      },
    });
    await createAuditLog({
      entityTitle: printer.id,
      entityId: printer.id,
      entityType: ENTITY_TYPE.PRINTER,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    console.error(`Failed to update signature display setting for printer with id ${data.printerId}:`, error);
  }

  revalidatePath(`/dashboard/printers/${data.printerId}`);
  return { data: printer };
};

export const updateDisplaySignature = createSafeAction(UpdateDisplaySignature, handler);
