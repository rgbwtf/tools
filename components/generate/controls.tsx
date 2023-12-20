import React, { FC } from 'react';
import { ControlsProps } from "@/types";

const Controls: FC<ControlsProps> = ({ handleDownload, randomRgb }) => {
	return (
		<div className="my-6 grid grid-cols-3 justify-center md:grid-cols-5">
			<button
				type="button"
				onClick={handleDownload}
				className="col-span-1 col-start-2 hidden rounded-md bg-zinc-800 px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-zinc-900 sm:block md:col-start-3 md:text-sm"
			>
				Download
			</button>
			<button
				type="button"
				onClick={randomRgb}
				className="col-span-1 col-start-2 rounded-md bg-zinc-800 px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-zinc-900 sm:hidden md:col-start-3 md:text-sm"
			>
				Randomize
			</button>
		</div>
	);
}

export default Controls;