import { FC, ReactNode } from 'react'
import Container from '@/components/container'

interface PrinterProps {
	title: string | undefined;
  children?: ReactNode;
}

const Printer = ({
	title,
	children
}: PrinterProps) => {
  return (
		<Container>
			<section
				className="flex animate-fade-up flex-col items-center gap-5 text-center justify-center opacity-0 h-full w-full"
				style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
			>
				<div className="mt-8 hidden w-full justify-center sm:flex">
					<h1 className="text-3xl font-bold">
						{`${title}`}
					</h1>
				</div>
				{children}
			</section>
		</Container>
  );
};

export default Printer;