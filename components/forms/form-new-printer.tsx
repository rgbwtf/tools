"use client"

import { useState, useTransition } from "react";
import { User } from "@prisma/client"
import { useAction } from "@/hooks/use-action";
import { Cloud, File } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/shared/icons"

import { createPrinter } from "@/actions/create-printer"
import { FormInput } from "./form-input"
import { FormErrors } from "./form-errors";
import { useDropzone } from 'react-dropzone'
import { useUploadThing } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"

interface NewPrinterFormProps {
  user: Pick<User, "id">
}

export function NewPrinterForm({ user }: NewPrinterFormProps) {
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File[]>([])

  const router = useRouter()
  const { startUpload } = useUploadThing('printerThumbnail')

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: async (acceptedFile) => {
      setFile(acceptedFile)
    },
    maxFiles: 1,
    accept: {
      'image/png': ['.png', '.PNG'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg': ['.svg'],
    },
    multiple: false,
    disabled: isPending,
  })

  const { execute: executeCreatePrinter, fieldErrors: createPrinterFieldErrors } = useAction(createPrinter, {
    onSuccess: async (data) => {
      toast({
        title: 'New printer created.',
        description: 'Hold on while we update it with your image.',
        variant: 'default'
      })
      router.push(`/dashboard/printers/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong createPrinter errir',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  })

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const title = formData.get("title") as string;
      const isFile = file.length > 0;
      if (!isFile) {
        await toast({
          title: 'File is required',
          description: 'Please upload an image.',
          variant: 'destructive',
        })
        return
      }
      const res = await startUpload(file)
      if (!res) {
        await toast({
          title: 'Something went wrong res',
          description: 'Please try again later',
          variant: 'destructive',
        })
        return
      }
      const imageId = res[0].key
      const imageUrl = res[0].url
      try {
        await executeCreatePrinter({
          title: title,
          userId: user.id,
          imageId: imageId,
          imageUrl: imageUrl,
        });
      } catch (error) {
        await toast({
          title: 'Something went wrong data',
          description: 'Please try again later',
          variant: 'destructive',
        })
        return
      }
    })
  }

  return (
    <form action={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>New Printer</CardTitle>
          <CardDescription>
            Enter the name of the printer you want to add and upload a thumbnail image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <FormInput
              id="title"
              label="Title"
              type="text"
              errors={createPrinterFieldErrors}
            />
            <div
              {...getRootProps()}
              className='relative border h-64 border-dashed'>
              <div className='flex items-center justify-center h-full w-full'>
                <Label
                  htmlFor='image'
                  className='flex flex-col items-center justify-center w-full h-full cursor-pointer'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Cloud className='h-6 w-6 mb-2' />
                    <p className='mb-2 text-sm'>
                      <span className='font-semibold'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className='text-xs'>
                      Image (up to 4MB)
                    </p>
                  </div>

                  {acceptedFiles && acceptedFiles[0] ? (
                    <div className='max-w-xs flex items-center overflow-hidden outline outline-[1px] divide-x'>
                      <div className='px-3 py-2 h-full grid place-items-center'>
                        <File className='h-4 w-4' />
                      </div>
                      <div className='px-3 py-2 h-full text-sm truncate'>
                        {acceptedFiles[0].name}
                      </div>
                    </div>
                  ) : null}
                  <Input
                    {...getInputProps()}
                    type="file"
                    id='image'
                    name='image'
                    disabled={isPending}
                  />
                </Label>
                <FormErrors
                  id="image"
                  errors={createPrinterFieldErrors}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Building...
              </>
            ) : (
              <>
                Build
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
