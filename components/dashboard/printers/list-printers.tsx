import { prisma } from "@/lib/db"
import { User } from "next-auth"
import { formatDistanceToNow } from 'date-fns'
import PrintersListEmpty from "./list-printers-empty"
import Link from "next/link"
import Image from "next/image"
const PrintersList = async ({
	user,
}: {
	user: User
}) => {
	const printers = await prisma.printer.findMany({
		where: {
			userId: user.id,
		},
	});

  return (
		<>
			{printers && printers.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{printers.map((printer) => (
						<div
							key={printer.id}
							className="relative flex items-center space-x-3 border px-6 py-5 shadow-sm"
						>
							<div className="shrink-0">
								<Image className="h-20 w-20" src={printer.imageUrl || ''} alt={printer.title} width={600} height={600} />
							</div>
							<div className="min-w-0 flex-1">
								<Link href={`/dashboard/printers/${printer.id}`} className="focus:outline-none">
									<span className="absolute inset-0" aria-hidden="true" />
									<p className="text-sm font-medium">{printer.title}</p>
									<p className="truncate text-sm">{`Last updated ${formatDistanceToNow(new Date(printer.updatedAt))}`}</p>
								</Link>
							</div>
						</div>
					))}
				</div>
			) : (
				<PrintersListEmpty />
			)}
		</>
  )
}

export default PrintersList
