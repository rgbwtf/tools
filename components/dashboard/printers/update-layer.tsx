'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormUpdateLayer from '@/components/forms/form-update-layer'

const UpdateLayer = ({
  layerId,
}: {
  layerId: string
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
        <Button
          type="button"
          variant="ghost"
        >Update</Button>
      </DialogTrigger>

      <DialogContent>
        <FormUpdateLayer
          layerId={layerId}
          closeDialog={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UpdateLayer