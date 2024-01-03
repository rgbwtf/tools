import { Icons } from "@/components/shared/icons"

export default function PrintersListEmpty() {
  return (
    <div className="text-center border my-4 p-16">
      <Icons.printer className="mx-auto h-12 w-12" />
      <h3 className="mt-2 text-sm font-semibold">No printers</h3>
      <p className="mt-1 text-sm">Get started by creating a new printer.</p>
    </div>
  )
}
