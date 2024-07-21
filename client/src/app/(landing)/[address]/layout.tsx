import { GlassyBackground } from "@/views";

export const metadata = {
	title: "Pools",
	description: "Pools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main
			className="pools"
			data-group="parent"
			style={{
				marginTop: "4.5rem",
			}}
		>
			<div className="h-[51rem] w-[72.75rem]">
				<GlassyBackground
					background="#231926"
					color1="#DED620"
					color2="#B2FDB6"
					deg={145}
				>
					{children}
				</GlassyBackground>
			</div>
		</main>
	);
}
