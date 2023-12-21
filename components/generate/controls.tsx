import React, { FC } from 'react';
import { ControlsProps } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils'

const Controls: FC<ControlsProps> = ({ handleDownload, randomRgb, className }) => {
	return (
		<div className={cn(className)}>
			<Button
				variant="outline"
				onClick={handleDownload}
				className="hidden sm:block"
			>
				Download
			</Button>
			<Button
				variant="outline"
				onClick={randomRgb}
				className="sm:hidden"
			>
				Randomize
			</Button>
		</div>
	);
}

export default Controls;