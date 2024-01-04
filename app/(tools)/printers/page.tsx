import Container from "@/components/container"
import { prisma } from "@/lib/db"
import Image from "next/image"

export const metadata = {
  title: "Printers",
  description: "Explore generative prints for any RGB value.",
}

export default async function PrintersPage() {
  const printers = await prisma.printer.findMany()


  return (
    <Container>
      <div className="flex w-full flex-col py-8 md:py-8 max-w-[48rem] mx-auto">
        <div className="border-b pb-5">
          <h1 className="text-base font-semibold leading-6">Printers</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[48rem] mx-auto">
        {printers && printers.map((printer, index) => (
          <div
            key={index}
            className="relative flex items-center space-x-3 border px-6 py-5 shadow-sm"
          >
            <div className="shrink-0">
              <Image
                className="h-20 w-20"
                src={printer.imageUrl || ""}
                alt={printer.title || ""}
                width={600}
                height={600}
              />
            </div>
            <div className="min-w-0 flex-1">
              <a href={`/printers/${printer.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <h3 className="text-xl font-medium">{printer.title}</h3>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
