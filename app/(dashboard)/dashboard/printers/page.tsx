import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { NewPrinterForm } from "@/components/forms/form-new-printer"
import { PERMISSIONS } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PrintersList from "@/components/dashboard/printers/list-printers"

export const metadata = {
  title: "Printers",
  description: "A list of all your printers.",
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
        heading="Printers"
        text="A list of all your printers."
      >
        <Button variant="default">
          <Link href="/dashboard/printers/create">
            Create Printer
          </Link>
        </Button>
      </DashboardHeader>
      <PrintersList user={user} />
    </DashboardShell>
  )
}
