import { CardSkeleton } from "@/components/shared/card-skeleton"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Overview" text="Account dashboard" />
      <div className="divide-border-200 divide-y border">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
