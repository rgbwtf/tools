import { Input } from '../ui/input'
import { PrintSettingsSchema } from '@/lib/validations/printer'
import { toast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { channels, downloadDisabled } from '@/config/printer'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'

const RgbSettings = (props: any) => {
	const parsed = PrintSettingsSchema.safeParse(props);

	if (!parsed.success) {
		console.error(parsed.error);
		// handle error
		return;
	}
	const {
    rgb,
    handleInputChange,
    randomRgb,
    handleDownload,
	} = parsed.data;

	if (rgb === null) {
		console.error(rgb);
		toast({
			title: 'Input is required',
			description: "Please try again.",
			variant: 'destructive',
		})
		return null;
	}

	if (!rgb || !Array.isArray(rgb)) {
    console.error('rgb is not defined or not an array:', rgb);
    // handle error, e.g., return null or a default value
    return null;
}
	
	return (
		<>
			<div className="mb-3 grid grid-flow-col place-content-center">
				{channels.map((channel, index) => (
					<div className="flex flex-col items-center" key={index}>
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
					disabled={downloadDisabled}
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