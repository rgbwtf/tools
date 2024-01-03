import { User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PERMISSIONS } from "@prisma/client"

type UserId = string

type Permission = keyof typeof PERMISSIONS

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId,
      permissions: Permission
    }
  }
}
