import { CardSkeleton } from "@/components/shared/card-skeleton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default function DashboardCreatePrinterLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Printer"
        text="Set up your printer and start generating."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
