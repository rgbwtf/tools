'use client'

import { useState, useEffect, ChangeEvent } from "react"
import { generateRgb } from "@/lib/rgb"
import Signature from "@/components/canvases/canvas-signature"
import Palette from "@/components/canvases/canvas-palette"
import RgbSettings from "@/components/shared/printer-settings"
import { Rgb } from "@/lib/validations/printer"
import Printer from "@/components/printer"
import Cartridge from "@/components/cartridges/cartidge-signature"

export default function GeneratePage() {
  return (
    <Printer title="Signature">
			<Cartridge />
		</Printer>
  )
}