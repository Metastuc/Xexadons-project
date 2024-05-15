import "./index.scss";

import { Discord, GitBook, X } from "@/assets";
import { commonProps } from "@/types";

export function Footer({ group }: commonProps) {
	return (
		<footer data-group="parent">
			<div
				data-group="wrapper"
				className={`${group}__wrapper`}
			>
				<ul className={`${group}__links`}>
					<li>about</li>
					<li>ecosystem</li>
					<li>Terms of use</li>
					<li>media</li>
					<li>contact</li>
					<li>documentation</li>
				</ul>

				<ul className={`${group}__links`}>
					<li>
						<i> {X()}</i>
					</li>
					<li>
						<i> {Discord()}</i>
					</li>
					<li>
						<i> {GitBook()}</i>
					</li>
				</ul>
			</div>
		</footer>
	);
}
