"use client";

import { usePathname } from "next/navigation";

import { Features, Footer, Hero, Services } from "@/components";

export default function Landing() {
	const pathname = usePathname();
	return (
		<>
			<main
				className="main"
				data-group="parent"
				style={{
					marginTop: `${pathname === "/" ? "0" : "8rem"}`,
					flexDirection: "column",
				}}
			>
				<Hero group="hero" />

				<Features group="features" />

				<Services group="services" />
			</main>

			<Footer group="footer" />
		</>
	);
}
