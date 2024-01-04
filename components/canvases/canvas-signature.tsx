import React, { FC } from "react";
import { SignatureProps } from "@/types";
import { cn } from "@/lib/utils"

const CanvasSignature: FC<SignatureProps> = ({ binary, className }) => {
	// Convert the RGB values to binary
	const redBinary = binary[0];
	const greenBinary = binary[1];
	const blueBinary = binary[2];

  	// Create the SVG grid
	const svg: JSX.Element[][] = [];
	
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 5; col++) {
		// Determine which binary digit to use based on the column and row
		let binaryDigit: string = "";
		switch (col) {
			case 0:
				if (row === 1) {
				binaryDigit = greenBinary[7];
				} else if (row === 2) {
				binaryDigit = greenBinary[6];
				} else if (row === 3) {
				binaryDigit = greenBinary[5];
				} else if (row === 4) {
				binaryDigit = greenBinary[4];
				} else {
				binaryDigit = redBinary[0];
				}
				break;
			case 1:
				if (row === 1) {
				binaryDigit = blueBinary[0];
				} else if (row === 2) {
				binaryDigit = blueBinary[7];
				} else if (row === 3) {
				binaryDigit = blueBinary[6];
				} else if (row === 4) {
				binaryDigit = greenBinary[3];
				} else {
				binaryDigit = redBinary[1];
				}
				break;
			case 2:
				if (row === 1) {
				binaryDigit = blueBinary[1];
				} else if (row === 2) {
				binaryDigit = "0"; // origin
				} else if (row === 3) {
				binaryDigit = blueBinary[5];
				} else if (row === 4) {
				binaryDigit = greenBinary[2];
				} else {
				binaryDigit = redBinary[2];
				}
				break;
			case 3:
				if (row === 1) {
				binaryDigit = blueBinary[2];
				} else if (row === 2) {
				binaryDigit = blueBinary[3];
				} else if (row === 3) {
				binaryDigit = blueBinary[4];
				} else if (row === 4) {
				binaryDigit = greenBinary[1];
				} else {
				binaryDigit = redBinary[3];
				}
				break;
			case 4:
				if (row === 1) {
				binaryDigit = redBinary[5];
				} else if (row === 2) {
				binaryDigit = redBinary[6];
				} else if (row === 3) {
				binaryDigit = redBinary[7];
				} else if (row === 4) {
				binaryDigit = greenBinary[0];
				} else {
				binaryDigit = redBinary[4];
				}
				break;
			default:
				break;
			}

			// Create the 3 by 3 grid for each binary digit
			const grid: JSX.Element[] = [];
			
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					let fill;
					// Select for the first binary digit for each color channel
					if ((row === 0 && col === 0) || (row === 4 && col === 4) || (row === 1 && col === 1) || (row === 2 && col === 2)) {
					// Fill the center pixel if the binary digit is 0, otherwise leave it blank
					if (i === 1 && j === 1) {
						if (binaryDigit === "0") {
						
						fill = "black";
						} else {
						fill = "white";
						}
					} else {
						fill = binaryDigit === "0" ? "white" : "black";
					}
					} else {
					fill = binaryDigit === "0" ? "white" : "black";
					}

					grid.push(
						<rect
						key={`${col * 3 + j}-${row * 3 + i}`}
						x={col * 3 + j}
						y={row * 3 + i}
						width="1"
						height="1"
						fill={fill}
						/>
					);
				}
			}
			svg.push(grid);
		}
	}

	return (
		<svg className={cn(className)} viewBox="0 0 15 15" height="15" width="15">
			{svg}
		</svg>
	);
};

export default CanvasSignature;
