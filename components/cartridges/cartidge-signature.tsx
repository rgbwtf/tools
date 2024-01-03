'use client'

import { useCallback, useEffect, useState, ChangeEvent } from "react"
import { generateRgb } from "@/lib/rgb"
import { Rgb } from "@/lib/validations/printer"
import PrinterSettings from "../shared/printer-settings"
import Signature from "@/components/canvases/canvas-signature"
import Palette from "@/components/canvases/canvas-palette"
import { channel } from "diagnostics_channel"

const CartridgeSignature = () => {
	const [binary, setBinary] = useState(["00000000","00000000","00000000"]);
	const [rgb, setRgb] = useState<Rgb>([0, 0, 0]);
	const [rgbHistory, setRgbHistory] = useState<Rgb[]>([[0, 0, 0]]);
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

	const randomRgb = (): void => {
		setRgb(generateRgb());
		setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
		setCurrentHistoryIndex(currentHistoryIndex + 1);
	};

	const handleInputChange = (channel: number, event: ChangeEvent<HTMLInputElement>): void => {
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

	const handleDownload = (): void => {
		const svgElement = document.querySelector('#signature svg');
		if (!svgElement) {
			console.error('SVG element not found');
			return;
		}
		// Clone the SVG element to avoid modifying the one displayed on the page
		const clonedSvgElement = svgElement.cloneNode(true) as SVGElement;
		// Remove class attribute from the cloned SVG element
		clonedSvgElement.removeAttribute('class');
		// No need to add custom height and width as we are not modifying the original element
		svgElement.setAttribute('height', '15');
		svgElement.setAttribute('width', '15');
		const serializer = new XMLSerializer();
		const source = serializer.serializeToString(clonedSvgElement);
		const link = document.createElement('a');
		link.download = `${rgb}.svg`;
		link.href = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }));
		link.click();
	};

	useEffect(() => {	  
		window.addEventListener("keydown", handleKeyDown);
		return () => {
		  window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

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
		setBinary(newBinary);
	}, [rgb]);

	return (
		<div>
			<div className="my-8 flex flex-col justify-center sm:flex-row">
				<Signature binary={binary as [string, string, string]} />
				<Palette rgb={rgb as [number, number, number]} />
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

export default CartridgeSignature