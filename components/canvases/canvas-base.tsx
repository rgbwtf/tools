import { CanvasProps } from "@/lib/validations/printer"
import Image from "next/image"
import { Icons } from "@/components/shared/icons"

const Canvas = ({
	rgb,
	data,
	binary,
}: CanvasProps) => {
	return (
		<div className="relative h-60 w-60 place-self-center border md:h-96 md:w-96">
			{rgb.map((value, index) => {
				const channel = ['red', 'green', 'blue'][index]; // get the corresponding channel
				const layers = data?.[channel];
				if (!layers || layers.length === 0) {
					return (
						<div className="flex justify-center items-center h-full w-full absolute top-0 left-0 opacity-30">
							<Icons.media className="w-10 h-10" />
						</div>
					);
				}

				// Find the layer with the corresponding value
				const layer = layers.find(layer => layer.value === value);
				if (!layer) {
					return (
						<div className="flex justify-center items-center h-full w-full absolute top-0 left-0 opacity-30">
							<Icons.media className="w-10 h-10" />
						</div>
					);
				}

				return (
					<Image
						width={600}
						height={600} 
						key={index} 
						src={layer.imageUrl} 
						alt={`layer ${index}`} 
						style={{ 
							position: 'absolute', 
							top: 0, 
							left: 0, 
							width: '100%', 
							height: '100%', 
							objectFit: 'cover', 
						}} 
					/>
				);
			})}
		</div>
	)
}

export default Canvas;
