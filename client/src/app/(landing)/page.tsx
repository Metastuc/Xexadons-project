import "./page.scss";

import { Hero } from "@/components";
import { NavigationBar } from "@/views";

export default function Landing() {
	return (
		<>
			<main
				className="main"
				data-group="parent"
			>
				<Hero group="hero" />
			</main>
		</>
	);
}
