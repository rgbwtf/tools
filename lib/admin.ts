// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { prisma } from "@/lib/db";
import { UserAdmin } from "types";
import { PERMISSIONS } from "@prisma/client";

export async function getAdmin(
  userId: string,
): Promise<UserAdmin> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      permissions: PERMISSIONS.ADMIN,
    },
  })

  if (!user) {
    throw new Error("User is not authorized")
  }

  return {
    ...user,
  }
}
