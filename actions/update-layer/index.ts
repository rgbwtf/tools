"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateLayer } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { getCurrentUser } from "@/lib/session"
import { getAdmin } from "@/lib/admin"
import { utapi } from "@/lib/utapi"

const handler = async (data: InputType): Promise<ReturnType> => {
  const user = await getCurrentUser()

  if (!user || !user.id) throw new Error('Unauthorized')

  const isAdmin = await getAdmin(user.id)

  if (!isAdmin) throw new Error('Unauthorized')

  // Find existing cartridge for the printerId
  const existingLayer = await prisma.layer.findUnique({
    where: { id: data.layerId }
  });

  // If cartridge exists, delete all layers and the cartridge itself
  if (existingLayer) {
    const fileName = existingLayer.imageId;
    // Delete images from uploadthing using utapi
    await utapi.deleteFiles(fileName);
  }

  let layer
  try {
    // Create a new cartridge for the printerId
    layer = await prisma.layer.update({
      where: { id: data.layerId },
      data: {
        imageId: data.imageId,
        imageUrl: data.imageUrl,
      },
    });
    await createAuditLog({
      entityTitle: layer.id,
      entityId: layer.id,
      entityType: ENTITY_TYPE.LAYER,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    console.error(`Failed to create cartridge for printer with id ${data.layerId}:`, error);
  }

  let cartridge
  try {
    cartridge = await prisma.cartridge.findUnique({
      where: { id: layer.cartridgeId },
    })
  } catch (error) {
    console.error(`Failed to find cartidge for printer with id ${cartridge.printerId}:`, error);
  }

  revalidatePath(`/dashboard/printers/${cartridge.printerId}`);
  return { data: layer };
};

export const updateLayer = createSafeAction(UpdateLayer, handler);
