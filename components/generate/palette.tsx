import React, { FC } from "react";
import { PaletteProps } from "@/types";

const Palette: FC<PaletteProps> = ({ rgb }) => {
  return (
    <div
		className="h-32 w-32 md:h-60 md:w-60 sh m-4 border place-self-center"
		style={{
			backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
		}}
    />
  );
};

export default Palette;