import Image from "next/image"

interface LayerProps {
	src: string;
	index: number;
}
const Layer = ({
	src,
	index,
}: LayerProps) => {
  return (
		<Image 
			key={index} 
			src={src}
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
};

export default Layer;

