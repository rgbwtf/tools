import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"
import { User as NextAuthUser } from "next-auth"
import { User, PERMISSIONS } from "@prisma/client"
import { prisma } from "@/lib/db"

interface DashboardNavProps {
  items: SidebarNavItem[],
  user: NextAuthUser,
}

const DashboardNav = async ({
  items,
  user
}: DashboardNavProps) => {
  if (!items?.length) {
    return null
  }

  const toolsUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })

  const isAdmin = toolsUser?.permissions?.includes(PERMISSIONS.ADMIN)

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"]
        return (
          item.href && (
            <Link key={index} href={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
      {isAdmin && (
        <Link href="/dashboard/printers">
          <span
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icons.printer className="mr-2 h-4 w-4" />
            <span>Printers</span>
          </span>
        </Link>
      )}
    </nav>
  )
}
export default DashboardNav