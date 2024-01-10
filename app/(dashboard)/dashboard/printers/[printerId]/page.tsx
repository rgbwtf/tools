export const maxDuration = 300;

import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { PERMISSIONS } from "@prisma/client"
import { prisma } from "@/lib/db"
import DeletePrinter from "@/components/forms/form-delete-printer"
import UpdateCartridge from "@/components/dashboard/printers/update-cartridge"
import { utapi, UploadFileResponse } from "@/lib/utapi"
import { printerConfig } from "@/config/printer"
import LayersList from "@/components/dashboard/printers/list-layers"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import UpdateDisplaySignature from "@/components/dashboard/printers/update-display-signature"

interface EditPrinterIdPageProps {
  params: {
    printerId: string;
  };
};

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
    title: printer?.title,
    description: `Edit page for ${printer?.title}`,
  };
}

const chunkSize = printerConfig.chunkSize;

const uploadFilesInChunks = async (files) => {
  const responses: UploadFileResponse[][] = [];
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);
    const response = await utapi.uploadFiles(chunk);
    responses.push(Array.isArray(response) ? response : [response]);
  }
  return responses.flat();
}

const updateCartridge = async (formData: FormData): Promise<any> => {
  'use server'
  const red = formData.getAll('red');
  const green = formData.getAll('green');
  const blue = formData.getAll('blue');

  const redResponse = await uploadFilesInChunks(red);
  const greenResponse = await uploadFilesInChunks(green);
  const blueResponse = await uploadFilesInChunks(blue);

  const response = {
    red: redResponse,
    green: greenResponse,
    blue: blueResponse,
  };
  return response;
}

export default async function EditPrinterPage({
  params: { 
    printerId 
  } 
}: EditPrinterIdPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const isAdmin = user.permissions?.includes(PERMISSIONS.ADMIN)

  if (!isAdmin) {
    redirect("/dashboard")
  }
  
  const printer = await prisma.printer.findUnique({
    where: {
      id: printerId,
    }
  });

  if (!printer) {
    // Handle the case when printer is null, e.g., show an error message or redirect
    return <div>Printer not found</div>;
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${printer?.title}`}
        text="Printer settings and configuration."
      >
        <Link
          href={`/printers/${printerId}/`}
          className={cn(
            buttonVariants({ variant: "default" })
          )}
        >
          View Printer
        </Link>
      </DashboardHeader>
      <div className="grid gap-10">
        <UpdateDisplaySignature printerId={printerId} displaySignature={printer.displaySignature}/>
      </div>
      <UpdateCartridge printerId={printerId} updateCartridge={updateCartridge} />
      <LayersList printerId={printerId} updateCartridge={updateCartridge}/>
      <div className="grid gap-10">
        <DeletePrinter printerId={printerId} />
      </div>
    </DashboardShell>
  )
}
