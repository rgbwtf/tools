'use client'

import { UploadStatus } from "@prisma/client"
import { useCallback, useEffect, useState, useRef } from "react"
import { generateRgb } from "@/lib/rgb"
import { OrderedData, Rgb} from "@/lib/validations/printer"
import PrinterSettings from "../shared/printer-settings"
import Canvas from "@/components/canvases/canvas-base"
import domtoimage from 'dom-to-image';

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
	displaySignature: boolean;
}

const CartridgeBase = ({
	data,
	displaySignature
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
		let value = event.target.valueAsNumber;
		if (isNaN(value)) {
			value = 0; // or any default value you want
		} else if (value > 255) {
			value = 255; // limit the value to 255
		}
		const newRgb = [...rgb] as Rgb;
		newRgb[channel] = value;
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

	useEffect(() => {	  
		window.addEventListener("keydown", handleKeyDown);
		return () => {
		  window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const printRef = useRef<HTMLDivElement>(null);

	const handleDownload = (): void => {
		const printElement = printRef.current;
		if (!printElement) {
			console.error('Print element is not available.');
			return;
		}
	
		// Clone the printElement
		const clonedPrintElement = printElement.cloneNode(true) as HTMLElement;
	
		// Find the image element within the clonedPrintElement
		const imageElement = clonedPrintElement.querySelector('img');
		if (!imageElement) {
			console.error('Image element is not found in the cloned element.');
			return;
		}
	
		// Update the cloned image element's style to its natural size
		imageElement.style.width = `${imageElement.naturalWidth}px`;
		imageElement.style.height = `${imageElement.naturalHeight}px`;
	
		// Use the natural dimensions of the image for the canvas
		const width = imageElement.naturalWidth;
		const height = imageElement.naturalHeight;
	
		// Render the cloned element with dom-to-image at the full resolution
		domtoimage.toBlob(clonedPrintElement, { width, height })
			.then(blob => {
				const img = new Image();
				img.onload = () => {
					const offScreenCanvas = document.createElement('canvas');
					offScreenCanvas.width = width;
					offScreenCanvas.height = height;
					const ctx = offScreenCanvas.getContext('2d');
					if (!ctx) {
						console.error('Failed to get 2D context');
						return;
					}
					ctx.drawImage(img, 0, 0, width, height);
	
					// Convert canvas to blob and download
					offScreenCanvas.toBlob(blob => {
						if (!blob) {
							console.error('Failed to create blob from canvas');
							return;
						}
						const dataUrl = URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = dataUrl;
						link.download = 'download.png'; // Set the filename for download
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(dataUrl);
					}, 'image/png');
				};
				img.src = URL.createObjectURL(blob);
				img.onerror = (error) => {
					console.error('Image failed to load', error);
				};
			})
			.catch((error) => {
				console.error('Failed to capture the cloned element at full resolution', error);
			});
	};

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
				<Canvas
					rgb={rgb}
					data={orderedData}
					binary={binary}
					ref={printRef}
					displaySignature={displaySignature}
				/>
			</div>
			<PrinterSettings
				rgb={rgb}
				handleInputChange={handleInputChange}
				randomRgb={randomRgb}
				handleDownload={handleDownload}
			/>
		</div>
	);
}

export default CartridgeBase