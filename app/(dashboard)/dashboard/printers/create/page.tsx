import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { NewPrinterForm } from "@/components/forms/form-new-printer"
import { PERMISSIONS } from "@prisma/client"

export const metadata = {
  title: "Create Printer",
  description: "Set up your printer and start generating.",
}

export default async function CreatePrinterPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const isAdmin = user.permissions?.includes(PERMISSIONS.ADMIN)

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Printer"
        text="Set up your printer and start generating."
      />
      <div className="grid gap-10">
        <NewPrinterForm user={{ id: user.id }} />
      </div>
    </DashboardShell>
  )
}
