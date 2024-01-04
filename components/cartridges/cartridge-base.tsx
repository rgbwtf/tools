'use client'

import { UploadStatus } from "@prisma/client"
import { useCallback, useEffect, useState, useRef } from "react"
import { generateRgb } from "@/lib/rgb"
import { OrderedData, Rgb} from "@/lib/validations/printer"
import PrinterSettings from "../shared/printer-settings"
import Canvas from "@/components/canvases/canvas-base"
import { downloadOptions } from "@/config/printer"
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
    if (!printElement) return;

    // Get all images within the SVG
    const images = printElement.querySelectorAll('img');

    // Convert NodeList to Array
    const imageArray = Array.from(images);

    // Create a promise for each image
    const imagePromises = imageArray.map((img, index) => new Promise<void>((resolve, reject) => {
			if (img.complete) {
				resolve();
			} else {
				img.onload = () => resolve();
				img.onerror = () => {
					console.error(`Image at index ${index} failed to load`);
					reject();
				};
			}
		}));

    // Wait for all images to load
    Promise.all(imagePromises)
        .then(() => {
						
            // All images are loaded, render the SVG
            domtoimage.toPng(printElement, {cacheBust: true})
                .then(function (dataUrl) {
										console.log(dataUrl);
                    var link = document.createElement('a');
                    link.download = 'my-image-name.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
        })
        .catch((error) => {
            // One or more images failed to load
            console.error('Image failed to load', error);
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
				<Canvas rgb={rgb} data={orderedData} binary={binary} ref={printRef}/>
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