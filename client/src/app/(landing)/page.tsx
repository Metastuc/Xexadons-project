import "./page.scss";

import { Hero } from "@/components";
import { NavigationBar } from "@/views";

export default function Landing() {
	return (
		<>
			<header
				className="header-navbar"
				data-group="parent"
			>
				<NavigationBar group={"header-navbar"} />
			</header>

			<main
				className="main"
				data-group="parent"
			>
				<Hero group="hero" />
			</main>
		</>
	);
}
