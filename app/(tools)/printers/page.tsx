import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { NewPrinterForm } from "@/components/forms/form-new-printer"
import { PERMISSIONS } from "@prisma/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function PrintersPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      >
        <Button variant="default">
          <Link href="/dashboard/printers/create">
            Create Printer
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-10">
        
        
      </div>
    </DashboardShell>
  )
}
