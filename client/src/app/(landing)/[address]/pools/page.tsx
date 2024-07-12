import { GlassyBackground, Pools } from "@/views";

export default function Page() {
	return (
		<div className="h-[51rem] w-[72.75rem]">
			<GlassyBackground
				background="#231926"
				color1="#DED620"
				color2="#B2FDB6"
				deg={145}
			>
				<Pools />
			</GlassyBackground>
		</div>
	);
}
