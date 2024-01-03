import { prisma } from "@/lib/db";
import Printer from "@/components/printer";
import Cartridge from "@/components/cartridges/cartridge-base";

interface PrinterIdPageProps {
  params: {
    printerId: string;
  };
};

const PrinterIdPage = async ({
  params,
}: PrinterIdPageProps) => {
  const printer = await prisma.printer.findUnique({
    where: {
      id: params.printerId,
    },
    include: {
      cartridges: {
        include: {
          layers: true,
        },
      },
    },
  });

  return (
    <Printer title={printer?.title}>
      <Cartridge data={printer?.cartridges ? printer.cartridges[0] : null} />
    </Printer>
  );
};

export default PrinterIdPage;
