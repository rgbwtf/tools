"use server";

import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeletePrinter } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { getAdmin } from "@/lib/admin"
import { utapi } from "@/lib/utapi"

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

  let printer;
  let response;
  try {
    // Find the cartridge associated with the printer
    printer = await prisma.printer.findFirst({
      where: {
        id: data.printerId,
      },
      include: {
        cartridges: true,
      }
    });

    // Get all imageIds from the layers
    if (!printer) {
      return {
        error: "Printer not found."
      }
    }

    if (printer.cartridges.length > 0) {
      const cartridge = printer.cartridges;

      const cartridgeId = cartridge[0].id;
      const layers = await prisma.layer.findMany({
        where: {
          cartridgeId: cartridgeId,
        },
        select: {
          imageId: true,
        }
      })
      const imageIds = layers.map(layer => layer.imageId);      
      
      await utapi.deleteFiles(imageIds);
    }

    if (printer.imageId) {
      await utapi.deleteFiles(printer.imageId);
    }

    // Delete printer if cartridge is not available
    printer = await prisma.printer.delete({
      where: {
        id: data.printerId,
      },
    });

    await createAuditLog({
      entityTitle: printer.id,
      entityId: printer.id,
      entityType: ENTITY_TYPE.PRINTER,
      action: ACTION.DELETE,
    })
    
    response = {
      data: printer
    }
  } catch (error) {
    response = {
      error: "Failed to create."
    }
  }

  revalidatePath(`/dashboard/printers/`);
  return response;
};

export const deletePrinter = createSafeAction(DeletePrinter, handler);
