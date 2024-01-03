'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-action'
import { toast } from '@/components/ui/use-toast'
import { Icons } from '../shared/icons'
import { deletePrinter } from '@/actions/delete-printer'


const DeletePrinter = ({
  printerId
}: {
  printerId: string
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const { execute, fieldErrors } = useAction(deletePrinter, {
    onSuccess: (data) => {
			setIsOpen(false)
      toast({
        title: 'Done!',
        description: 'Successfully deleted printer.',
        variant: 'default',
      })
    },
    onError: (error) => {
      toast({
        title: 'Could not delete printer.',
        description: 'Please try again later',
        variant: 'destructive',
      })
    }
  })

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      execute({printerId})
    });
    
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}>
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        asChild>
        <Button>Delete Printer</Button>
      </DialogTrigger>

      <DialogContent>
        Are you sure?
				<form action={onSubmit}>
					<Button
						type='submit'
						className='mt-4 w-full'
						disabled={isPending}
					>
						{isPending ? (
								<>
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Deleting...
								</>
							) : (
								<>
									Delete Printer
								</>
							)}
					</Button>
				</form>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePrinter