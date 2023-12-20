import React, { FC } from 'react';
import { ControlsProps } from "@/types";

const Controls: FC<ControlsProps> = ({ handleDownload, randomRgb }) => {
	return (
		<div className="grid grid-cols-3 md:grid-cols-5 justify-center my-6">
			<button
				type="button"
				onClick={handleDownload}
				className="rounded-md px-4 py-3 text-xs md:text-sm font-semibold text-white shadow-sm bg-zinc-800 hover:bg-zinc-900 col-span-1 col-start-2 md:col-start-3 hidden sm:block"
			>
				Download
			</button>
			<button
				type="button"
				onClick={randomRgb}
				className="rounded-md px-4 py-3 text-xs md:text-sm font-semibold text-white shadow-sm bg-zinc-800 hover:bg-zinc-900 col-span-1 col-start-2 md:col-start-3 sm:hidden"
			>
				Randomize
			</button>
		</div>
	);
}

export default Controls;