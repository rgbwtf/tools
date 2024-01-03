import { Button } from '../ui/button'
import { useDropzone } from 'react-dropzone'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Icons } from '../shared/icons'
import { useTransition } from 'react'
import { Cloud, File } from 'lucide-react'
import { useAction } from '@/hooks/use-action'
import { updateLayer } from '@/actions/update-layer'
import { useUploadThing } from '@/lib/uploadthing'

const FormUpdateLayer = ({
  layerId,
  closeDialog,
}: {
  layerId: string,
  closeDialog: () => void,
}) => {
  const [isPending, startTransition] = useTransition()

  const { startUpload } = useUploadThing('layerImage')

  const { execute: executeUpdateLayer } = useAction(updateLayer, {
    onSuccess: (data) => {
      closeDialog();
			return toast({
        title: 'Cartridge loaded.',
        description: 'Successfully uploaded cartridge.',
        variant: 'default',
      })
    },
    onError: (error) => {
      return toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  });

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    multiple: true,
    maxFiles: 1,
    accept: {
      'image/png': ['.png', '.PNG'],
      'image/svg+xml': ['.svg', '.SVG'],
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      event.preventDefault()
      const isFile = acceptedFiles.length > 0;
      if (!isFile) {
        await toast({
          title: 'File is required',
          description: 'Please upload an image.',
          variant: 'destructive',
        })
        return
      }
      const res = await startUpload(acceptedFiles)
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
        await executeUpdateLayer({
          layerId: layerId,
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
              id='layer'
              type="file"
              name="layer"
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

export default FormUpdateLayer;

