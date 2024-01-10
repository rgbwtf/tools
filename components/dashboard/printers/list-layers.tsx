import { prisma } from "@/lib/db"
import UpdateLayer from "./update-layer"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import Balancer from "react-wrap-balancer"


interface LayersListProps {
	printerId: string;
	updateCartridge: (formData: FormData) => void;
};

const LayersList = async ({
	printerId,
	updateCartridge,
}: LayersListProps) => {
	const cartridgeWithLayers = await prisma.cartridge.findFirst({
		where: {
			printerId: printerId,
		},
		include: {
			layers: {
				orderBy: [
					{ value: 'asc' },
				],
			},
		},
	});
	
	const layers = cartridgeWithLayers?.layers || [];

	const order = { 'red': 1, 'green': 2, 'blue': 3 };

	layers.sort((a, b) => {
		const orderA = a.channel ? order[a.channel] || 4 : 4;
		const orderB = b.channel ? order[b.channel] || 4 : 4;
	
		if (orderA !== orderB) {
			return orderA - orderB;
		} else {
			return (a.value || 0) - (b.value || 0);
		}
	});

	const layersByChannel = layers.reduce((acc, layer) => {
		if (!acc[layer.channel!]) {
			acc[layer.channel!] = [];
		}
		acc[layer.channel!].push(layer);
		return acc;
	}, {});

  return (
		<>
			{layers && layers.length > 0 ? (
				<Accordion type="single" collapsible className="w-full">
					{Object.keys(layersByChannel).map(channel => (
						<AccordionItem value={channel} key={channel}>
							<AccordionTrigger className="hover:no-underline">
								<div className="flex items-center">
									<div style={{backgroundColor: channel}} className="w-4 h-4 mr-2" />
									{channel.charAt(0).toUpperCase() + channel.slice(1).toLowerCase()}
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
									{layersByChannel[channel].map((layer) => (
										<li key={layer.imageUrl} className="relative">
											<div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden focus-within:ring-2">
												<Image src={layer.imageUrl} alt={`${layer.channel}: ${layer.value}`} width={600} height={600} className="w-full pointer-events-none object-cover group-hover:opacity-75 border" />
											</div>
											<div className="mt-4 flex justify-between">
												<p className="pointer-events-none mt-2 block truncate text-sm font-medium">{layer.channel}: {layer.value}</p>
												<UpdateLayer layerId={layer.id} />
											</div>
										</li>
									))}
								</ul>
						</AccordionContent>
					</AccordionItem>
					))}
				</Accordion>
			) : (
				<EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="image" />
          <EmptyPlaceholder.Title>No layers available</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
						<Balancer>
							You don&apos;t have any layers yet. Start by uploading a cartridge.
						</Balancer>
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
			)}
		</>
  )
}

export default LayersList
