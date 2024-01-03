'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormUpdateCartridge from '@/components/forms/form-update-cartridge'

const UpdateCartridge = ({
  printerId,
  updateCartridge,
}: {
  printerId: string
  updateCartridge: (formData: FormData) => void
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
        <Button>Update Cartridge</Button>
      </DialogTrigger>

      <DialogContent>
        <FormUpdateCartridge
          printerId={printerId}
          closeDialog={() => setIsOpen(false)}
          updateCartridge={updateCartridge}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCartridge