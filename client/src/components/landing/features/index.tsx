import "./index.scss";

import { featuresTexts } from "@/assets";
import { commonProps, featureText } from "@/types";
import { GlassyBackground } from "@/views";

export function Features({ group }: commonProps) {
	const content = featuresTexts.map((value: featureText, index: number) => {
		const {
			title,
			text,
			gradient: { color1, color2 },
		} = value;

		return (
			<li key={index}>
				<GlassyBackground
					background="#211824"
					color1={color1}
					color2={color2}
					deg={316}
				>
					<h2>{title}</h2>
					<p>{text}</p>
				</GlassyBackground>
			</li>
		);
	});

	return (
		<section className={`${group}`}>
			<ul
				className={`${group}__wrapper`}
				data-group="wrapper"
			>
				{content}
			</ul>
		</section>
	);
}
