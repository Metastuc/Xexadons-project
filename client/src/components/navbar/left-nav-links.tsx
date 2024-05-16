import Link from "next/link";
import { JSX } from "react";

import { NAVIGATION_LINKS } from "@/assets";
import { commonProps, navigationLink } from "@/types";

export function LeftNavigationLinks({ group }: commonProps) {
	let link: JSX.Element[];

	link = NAVIGATION_LINKS.map((item: navigationLink, index: number) => {
		return (
			<li key={index}>
				<Link href={item.url}>{item.title}</Link>
			</li>
		);
	});

	return (
		<>
			<nav className={`${group}__left`}>
				<ul>{link}</ul>
			</nav>
		</>
	);
}
