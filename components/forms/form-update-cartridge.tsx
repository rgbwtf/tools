'use client'

import { Button } from '../ui/button'
import { useDropzone } from 'react-dropzone'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Icons } from '../shared/icons'
import { useTransition } from 'react'
import { Cloud, File } from 'lucide-react'
import { useAction } from '@/hooks/use-action'
import { updateCartridgeLayers } from '@/actions/update-cartridge-layers'

const FormUpdateCartridge = ({
  printerId,
  closeDialog,
  updateCartridge,
}: {
  printerId: string,
  closeDialog: () => void,
  updateCartridge: (formData: FormData) => void,
}) => {
  const [isPending, startTransition] = useTransition()

  const { execute: executeUpdateCartridgeLayers } = useAction(updateCartridgeLayers, {
    onSuccess: (data) => {
      closeDialog();
			toast({
        title: 'Cartridge loaded.',
        description: 'Successfully uploaded cartridge.',
        variant: 'default',
      })
      return data
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
      throw error
    }
  });

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: async (acceptedFile) => {
      try {
        await Promise.all(acceptedFile.map(async (file) => {
          const filePath = file.path;
          const pattern = /^\/cartridge\/(red|green|blue)\/([0-9]+)\.(png|svg)$/;
          if (!pattern.test(filePath)) {
            throw new Error("Invalid file path")
          }
        }))
      } catch (error) {
        toast({
          title: 'Invalid file',
          description: 'The file does not match the required pattern',
          variant: 'destructive',
        });
        return
      }
    },
    multiple: true,
    maxFiles: 768,
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      event.preventDefault();
      const isFile = acceptedFiles.length > 0;

      if (!isFile) {
        await toast({
          title: 'File is required',
          description: 'Please upload an image.',
          variant: 'destructive',
        })
        return
      }

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        const filePath = file.path;
        const pattern = /^\/cartridge\/(red|green|blue)\/([0-9]+)\.(png|svg)$/;
        const match = filePath.match(pattern);
        if (match && match[1]) {
          formData.append(match[1], file);
        }
      });

      const response = await updateCartridge(formData)

      try {
        await executeUpdateCartridgeLayers({
          printerId: printerId,
          // @ts-ignore
          data: response,
        });
      } catch (error) {
        console.error(error); // Log any error that might occur
      }
    })
  }

  return (
    <div className='m-4'>
      <form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className='border h-64 border-dashed'
        >
          <Label
            htmlFor='cartridge'
            className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <Cloud className='h-6 w-6 mb-2' />
              <p className='mb-2 text-sm'>
                <span className='font-semibold'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
            </div>
            {acceptedFiles && acceptedFiles[0] ? (
              <div className='max-w-xsflex items-center overflow-hidden outline outline-[1px] divide-x'>
                <div className='px-3 py-2 h-full grid place-items-center'>
                  <File className='h-4 w-4' />
                </div>
                <div className='px-3 py-2 h-full text-sm truncate'>
                  {'/cartridge'}
                </div>
              </div>
            ) : null}
            <Input
              {...getInputProps()}
              id='cartridge'
              type="file"
              name="cartridge"
            />
          </Label>
        </div>
        <Button
            type='submit'
            className='mt-4 w-full'
            disabled={isPending}
          >
            {isPending ? (
                <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : (
                <>Update Cartridge</>
              )}
          </Button>
      </form>
    </div>
  );
};

export default FormUpdateCartridge;

