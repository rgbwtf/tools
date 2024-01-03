import React, { FC } from "react";
import { PaletteProps } from "@/types";

const CanvasPalette: FC<PaletteProps> = ({ rgb }) => {
  return (
    <div
			className="m-4 h-32 w-32 place-self-center border md:h-60 md:w-60"
			style={{
				backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
			}}
    />
  );
};

export default CanvasPalette;

