'use client'

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn, nFormatter } from "@/lib/utils"
import Balancer from "react-wrap-balancer"
import { Icons } from "@/components/shared/icons"
import { env } from "@/env.mjs"
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpRightIcon,
  CubeTransparentIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'

import { useState, useEffect, ChangeEvent } from "react"
import { generateRgb } from "@/lib/rgb"
import Signature from "@/components/generate/signature"
import RGBInputs from "@/components/generate/rgb-inputs"
import Palette from "@/components/generate/palette"
import Controls from "@/components/generate/controls"

export default function GeneratePage() {
  // RGB Signature
	const [binary, setBinary] = useState(["00000000","00000000","00000000"]);
	const [rgb, setRgb] = useState([0, 0, 0]);
	const [rgbHistory, setRgbHistory] = useState([[0, 0, 0]]);
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Randomize RGB
	const randomRgb = (): void => {
		setRgb(generateRgb());
		setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
		setCurrentHistoryIndex(currentHistoryIndex + 1);
	};

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

	const handleChange = (color: number, e: ChangeEvent<HTMLInputElement>): void => {
		const newRgb = [...rgb];
		newRgb[color] = e.target.valueAsNumber;
		setRgb(newRgb);
		setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), newRgb]);
		setCurrentHistoryIndex(currentHistoryIndex + 1);
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
		const handleKeyDown = (e: KeyboardEvent): void => {
		  switch (e.key) {
			case ' ':
			  setRgb(generateRgb());
			  setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
			  setCurrentHistoryIndex(currentHistoryIndex + 1);
			  break;
			case 'ArrowRight':
			  setRgb(generateRgb());
			  setRgbHistory([...rgbHistory.slice(0, currentHistoryIndex + 1), [...rgb]]);
			  setCurrentHistoryIndex(currentHistoryIndex + 1);
			  break;
			case 'ArrowLeft':
			  if (currentHistoryIndex > 0) {
				setCurrentHistoryIndex(currentHistoryIndex - 1);
				setRgb(rgbHistory[currentHistoryIndex]);
			  }
			  break;
			default:
			  break;
		  }
		};
	  
		window.addEventListener("keydown", handleKeyDown);
	  
		return () => {
		  window.removeEventListener("keydown", handleKeyDown);
		};
	}, [rgb, rgbHistory, currentHistoryIndex]); 		

  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div
          className="container flex max-w-[64rem] flex-col items-center gap-5 text-center animate-fade-up opacity-0"
          style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col sm:flex-row justify-center my-8">
            <Signature binary={binary as [string, string, string]} />
            <Palette rgb={rgb as [number, number, number]} />
          </div>
          <RGBInputs rgb={rgb as [number, number, number]} handleChange={handleChange} />
          <Controls handleDownload={handleDownload} randomRgb={randomRgb} />
          <div className="w-full hidden sm:flex justify-center text-zinc-800 mb-8">
            <p>Use <code>Spacebar</code> or ← → to randomize</p>
          </div>
        </div>
      </section>
    </>
  )
}