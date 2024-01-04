import React, { FC } from "react";
import { PaletteProps } from "@/types";
import { cn } from "@/lib/utils"

const CanvasPalette: FC<PaletteProps> = ({ rgb, className }) => {
  return (
    <div
			className={cn(className)}
			style={{
				backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
			}}
    />
  );
};

export default CanvasPalette;

