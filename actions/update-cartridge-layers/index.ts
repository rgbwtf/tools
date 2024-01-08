"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateCartridgeLayers } from "./schema";
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


  console.log({data})
  // Find existing cartridge for the printerId
  const existingCartridge= await prisma.cartridge.findUnique({
    where: { printerId: data.printerId },
    include: { layers: true }, // Include layers in the response
  });

  // If cartridge exists, delete all layers and the cartridge itself
  if (existingCartridge) {
    const fileNames = existingCartridge.layers.map(layer => layer.imageId);
    // Delete images from uploadthing using utapi
    await utapi.deleteFiles(fileNames);
    // Delete cartridge from database
    await prisma.cartridge.delete({ where: { id: existingCartridge.id } });
  }

  let newCartridge
  try {
    // Create a new cartridge for the printerId
    newCartridge = await prisma.cartridge.create({
      data: {
        printerId: data.printerId,
      },
    });
    await createAuditLog({
      entityTitle: newCartridge.id,
      entityId: newCartridge.id,
      entityType: ENTITY_TYPE.CARTRIDGE,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    console.error(`Failed to create cartridge for printer with id ${data.printerId}:`, error);
  }

  // Create a layer for each key object within each data object within each red, green, and blue object
  const colors = ['red', 'green', 'blue'];
  for (const color of colors) {
    for (const item of data.data[color]) {
      const key = item.data.key;
      const value = parseInt(item.data.name.replace(/\.(png|svg)$/, ''), 10); // Remove file extension and convert to number
      let layer
      try {
        layer = await prisma.layer.create({
          data: {
            value: value,
            channel: color,
            cartridgeId: newCartridge.id,
            imageId: key,
            imageUrl: item.data.url
          },
        });
        await createAuditLog({
          entityTitle: layer.id,
          entityId: layer.id,
          entityType: ENTITY_TYPE.LAYER,
          action: ACTION.CREATE,
        });
      } catch (error) {
        console.error(`Failed to create layer for cartridge with id ${newCartridge.id}:`, error);
      }
    }
  }

  const cartridge = await prisma.cartridge.findUnique({
    where: { printerId: data.printerId },
  });

  if (!cartridge) {
    throw new Error('Cartridge not found');
  }

  revalidatePath(`/dashboard/printers/${cartridge.printerId}`);
  return { data: cartridge };
};

export const updateCartridgeLayers = createSafeAction(UpdateCartridgeLayers, handler);
