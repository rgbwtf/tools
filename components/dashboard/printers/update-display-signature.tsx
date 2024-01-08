// components/dashboard/printers/update-display-signature.tsx
'use client'

import React, { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { useAction } from '@/hooks/use-action';
import { updateDisplaySignature } from '@/actions/update-display-signature';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@radix-ui/react-label'

const UpdateDisplaySignature = ({
  printerId,
  displaySignature,
}: {
  printerId: string;
  displaySignature: boolean;
}) => {
  const [isToggled, setIsToggled] = useState(displaySignature); // Initialize with the prop
  const [isPending, startTransition] = useTransition();

  const { execute: executeUpdateDisplaySignature } = useAction(updateDisplaySignature, {
    onSuccess: (data) => {
      const description = data.displaySignature ? 'Display signature toggled on successfully.' : 'Display signature toggled off successfully.';
      return toast({
        title: 'Printer updated',
        description: description,
        variant: 'default',
      });
    },
    onError: (error) => {
      return toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  });

  const handleToggle = (checked: boolean) => {
    startTransition( async () => {
      setIsToggled(checked);
      try {
        await executeUpdateDisplaySignature({
          printerId: printerId,
          displaySignature: checked,
        });
      } catch (error) {
        await toast({
          title: 'Something went wrong data',
          description: 'Please try again later',
          variant: 'destructive',
        });
      }
      console.log('printerId', printerId);
      console.log('checked', checked);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="displaySignature"
        name="displaySignature"
        checked={isToggled}
        onCheckedChange={handleToggle} // Changed from onChange to onCheckedChange
        disabled={isPending}
      />
      <Label htmlFor="displaySignature">Display signature</Label>
    </div>
  );
};

export default UpdateDisplaySignature;