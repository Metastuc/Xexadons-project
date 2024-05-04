import { Hero, NavBar } from "@/components";
import "./page.scss";

export default function Landing() {
	return (
		<>
			<header
				className="header"
				data-group="parent"
			>
				<NavBar group={`header`} />
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
