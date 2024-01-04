import { CanvasProps } from "@/lib/validations/printer"
import { Icons } from "@/components/shared/icons"
import Signature from "@/components/canvases/canvas-signature"
import { forwardRef, Ref} from "react"

const Canvas = forwardRef(({
	rgb,
	data,
	binary,
}: CanvasProps, ref: Ref<HTMLDivElement>) => {
	return (
		<div className="relative h-60 w-60 place-self-center border md:h-96 md:w-96" ref={ref}>
			{rgb.map((value, index) => {
				const channel = ['red', 'green', 'blue'][index]; // get the corresponding channel
				const layers = data?.[channel];
				if (!layers || layers.length === 0) {
					return (
						<div key={index} className="flex justify-center items-center h-full w-full absolute top-0 left-0 opacity-30 z-0">
							<Icons.media className="w-10 h-10" />
						</div>
					);
				}

				// Find the layer with the corresponding value
				const layer = layers.find(layer => layer.value === value);
				if (!layer) {
					return (
						<div key={index} className="flex justify-center items-center h-full w-full absolute top-0 left-0 opacity-30 z-0">
							<Icons.media className="w-10 h-10" />
						</div>
					);
				}

				return (
					<img
						key={index} 
						width={600}
						height={600}
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
						className="z-10"
					/>
				);
			})}
			<Signature
				binary={binary as [string, string, string]}
				className="z-20 absolute w-8 h-8 bottom-2 right-2 border-2 border-black"
			/>
		</div>
	)
});

Canvas.displayName = 'Canvas';

export default Canvas;

