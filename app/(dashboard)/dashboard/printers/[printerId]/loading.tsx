import { CardSkeleton } from "@/components/shared/card-skeleton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"


export default function DashboardCreatePrinterLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Printers"
        text="A list of all your printers."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
