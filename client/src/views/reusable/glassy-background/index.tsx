import "./index.scss";

import { ReactNode } from "react";

type GlassyBackgroundProps = {
	children: ReactNode;
	color1?: string | undefined;
	color2?: string | undefined;
	deg?: number | undefined;
	background?: string | undefined;
};

export function GlassyBackground({
	children,
	color1,
	color2,
	deg,
	background,
}: GlassyBackgroundProps) {
	return (
		<section
			style={{
				background: `linear-gradient(${background}, ${background}) padding-box, linear-gradient(${deg}deg, ${color1} 0%, #00031A00 51%, ${color2} 100%) border-box`,
			}}
			className="glassy-background"
		>
			{children}
		</section>
	);
}
