import { Input } from '../ui/input'
import { PrintSettingsSchema } from '@/lib/validations/printer'
import { toast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { channels } from '@/config/printer'
import { Label } from '../ui/label'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

const RgbSettings = (props: any) => {
	const {
		rgb,
		handleInputChange,
		randomRgb,
		handleKeyDown,
		handleDownload,
	} = PrintSettingsSchema.parse(props);

	if (rgb === null) {
		console.error(rgb);
		toast({
			title: 'Input is required',
			description: "Please try again.",
			variant: 'destructive',
		})
		return null;
	}

	useEffect(() => {	  
		window.addEventListener("keydown", handleKeyDown);
		return () => {
		  window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);
	
	return (
		<>
			<div className="mb-3 grid grid-flow-col place-content-center">
				{channels.map((channel, index) => (
					<div className="flex flex-col items-center">
						<Label
							htmlFor={channel}
							className="block text-center text-2xl font-bold"
						>
							{channel.charAt(0).toUpperCase()}
						</Label>
						<Input
							type="number" 
							name={channel}
							value={rgb[index]}
							onChange={(e) => handleInputChange(index, e)}
							min={0}
							max={255}
							className={cn(
								"text-3xl font-bold text-center py-6 px-2 pl-6 sm:px-8 border-l-0 sm:pl-12",
								{"border-l-1": index === 0}
							)}
						/>
					</div>
				))}
			</div>
			<div className="mb-8 w-full justify-center sm:flex">
				<Button
					variant="outline"
					onClick={handleDownload}
					className="hidden sm:block"
				>
					{'Download'}
				</Button>
				<Button
					variant="outline"
					onClick={randomRgb}
					className="sm:hidden"
				>
					{'Randomize'}
				</Button>
			</div>
			<div className="mb-8 hidden w-full justify-center sm:flex">
				<p>Use <code>Spacebar</code> or ← → to randomize</p>
			</div>
		</>
	);
}
export default RgbSettings;