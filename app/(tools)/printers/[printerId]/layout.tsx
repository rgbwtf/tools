import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";

// import { BoardNavbar } from "./_components/board-navbar";
import { getCurrentUser } from "@/lib/session"

export async function generateMetadata({ 
  params
 }: {
  params: {
    printerId: string;
  };
 }) {
  const printer = await prisma.printer.findUnique({
    where: {
      id: params.printerId,
    }
  });

  return {
    title: printer?.title
  };
}

const PrinterIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    printerId: string;
  }
}) => {

  const printer = await prisma.printer.findUnique({
    where: {
      id: params.printerId,
    },
  });

  if (!printer) {
    notFound();
  }

  return (
    <main className="relative pt-28 h-full">
      {children}
    </main>
  );
};

export default PrinterIdLayout;
