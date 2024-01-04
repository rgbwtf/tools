import { ChangeEvent } from "react"
import * as z from "zod"

export const createPrinterSchema = z.object({
  title: z.string().min(3).max(32),
  image: z.any(),
})

export const RGBValue = z.number().int().min(0).max(255)
  .refine(value => !isNaN(value), {
    message: "RGB value must be a number",
  })
  .refine(value => value !== undefined, {
    message: "RGB value is required",
  });

export const PrintSettingsSchema = z.object({
  rgb: z.tuple([RGBValue, RGBValue, RGBValue]),
  handleInputChange: z.function(z.tuple([z.number(), z.any()])).returns(z.void()),
  randomRgb: z.function(z.tuple([z.any()])).returns(z.void()),
  handleDownload: z.function().returns(z.void()),
});

export type Rgb = [number, number, number];

export type OrderedData = {
  red: { value: number; imageUrl: string; }[];
  green: { value: number; imageUrl: string; }[];
  blue: { value: number; imageUrl: string; }[];
} | null;

export const Binary = z.tuple([z.string(), z.string(), z.string()]);

export type CanvasProps = {
  rgb: Rgb;
  data: OrderedData;
  binary: string[];
  ref: any;
}

export type RGBInputsProps = {
	rgb: [number, number, number];
	handleInputChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
}