'use client'

import { UploadStatus } from "@prisma/client"
import { useCallback, useEffect, useState, ChangeEvent } from "react"
import { generateRgb } from "@/lib/rgb"
import { OrderedData, Rgb} from "@/lib/validations/printer"
import PrinterSettings from "../shared/printer-settings"
import Canvas from "@/components/canvases/canvas-base"

interface Layer {
  id: string;
  value: number | null;
  channel: string | null;
  imageId: string;
  imageUrl: string;
  uploadStatus: UploadStatus;
  cartridgeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CartridgeProps {
  data: {
    id: string;
    printerId: string | null;
    createdAt: Date;
    updatedAt: Date;
    layers?: Layer[];
  } | null;
}

interface LayersByChannel {
  red: Layer[];
  green: Layer[];
  blue: Layer[];
}

const CartridgeBase = ({
	data
}: CartridgeProps) => {
	const [binary, setBinary] = useState<string[]>(["00000000","00000000","00000000"]);
	const [rgb, setRgb] = useState<Rgb>([0, 0, 0]);
	const [rgbHistory, setRgbHistory] = useState([[0, 0, 0]]);
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
	const [orderedData, setOrderedData] = useState<OrderedData>(null);

	// Randomize RGB
	const randomRgb = (): void => {
		setRgb(generateRgb());
		setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
		setCurrentHistoryIndex(currentHistoryIndex + 1);
	};

	const handleInputChange = (channel: number, event: React.ChangeEvent<HTMLInputElement>) => {
		const newRgb = [...rgb] as Rgb;
		newRgb[channel] = event.target.valueAsNumber;
		setRgb(newRgb);
		setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), newRgb]);
		setCurrentHistoryIndex(currentHistoryIndex + 1);
	};

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		switch (e.code) {
			case 'Space':
			case 'ArrowRight':
				setRgb(generateRgb());
				setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
				setCurrentHistoryIndex(currentHistoryIndex + 1);
				break;
			case 'ArrowLeft':
				if (currentHistoryIndex > 0) {
					const newHistoryIndex = currentHistoryIndex - 1;
					setCurrentHistoryIndex(newHistoryIndex);
					setRgb(rgbHistory[newHistoryIndex] as Rgb);
				}
				break;
		}
	}, [rgb, rgbHistory, currentHistoryIndex])

	const handleDownload = (): void => {
		console.log('download');
	}

	useEffect(() => {
		const newBinary: string[] = [];
		for (let i = 0; i < 3; i++) {
		  newBinary.push(
			(rgb[i] & 128 ? '1' : '0') +
			(rgb[i] & 64 ? '1' : '0') +
			(rgb[i] & 32 ? '1' : '0') +
			(rgb[i] & 16 ? '1' : '0') +
			(rgb[i] & 8 ? '1' : '0') +
			(rgb[i] & 4 ? '1' : '0') +
			(rgb[i] & 2 ? '1' : '0') +
			(rgb[i] & 1 ? '1' : '0')
		  );
		}
		// Assuming setBinary is a state setting function
		setBinary(newBinary);
	}, [rgb]);

	useEffect(() => {
		if (data?.layers) {
			const layersByChannel = {
				red: [],
				green: [],
				blue: [],
			};
	
			data.layers.forEach(layer => {
				if (layer.channel) {
					layersByChannel[layer.channel].push(layer);
				}
			});
	
			setOrderedData(layersByChannel);
		} else {
			setOrderedData(null);
		}
	}, [data]);
	
	return (
		<div>
			<div className="my-8 flex flex-col justify-center sm:flex-row">
				<Canvas rgb={rgb} data={orderedData} binary={binary} />
			</div>
			<PrinterSettings
				rgb={rgb}
				handleInputChange={handleInputChange}
				randomRgb={randomRgb}
				handleKeyDown={handleKeyDown}
				handleDownload={handleDownload}
			/>
		</div>
	);
}

export default CartridgeBase