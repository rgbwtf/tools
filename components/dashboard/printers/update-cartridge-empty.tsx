'use client'

import FormUpdateCartridge from "@/components/forms/form-update-cartridge"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

const UpdateCartridgeEmpty = ({
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
        <Button
					type="button"
					className="relative block w-full h-auto border-2 py-48 border-dashed"
				>
					<div>
						<Icons.squareStack className="mx-auto h-12 w-12" />
						<span className="mt-2 block text-sm font-semibold">Add a new cartridge</span>
					</div>
				</Button>
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

export default UpdateCartridgeEmpty