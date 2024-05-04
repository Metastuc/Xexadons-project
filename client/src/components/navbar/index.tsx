"use client";

import { Cart, NAVIGATION_LINKS, Search } from "@/assets";
import { commonProps, navigationLink } from "@/types";
import "./index.scss";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import Link from "next/link";
import { Fragment, JSX, ReactNode } from "react";

type RenderButtonOnTheRightProps = commonProps & {
	children: ReactNode | string;
};

export function NavBar({ group }: commonProps): JSX.Element {
	return (
		<>
			<section
				className={`${group}__wrapper`}
				data-group={`wrapper`}
			>
				<Fragment>
					<RenderNavLinks group={group} />
				</Fragment>

				<div className={`${group}__right`}>
					<div>
						<i>{Search()}</i>
						<input
							type="text"
							placeholder="search collections"
						/>
					</div>

					<RenderButtonOnTheRight
						group={group}
						children={"enter app"}
					/>

					<RenderButtonOnTheRight
						group={group}
						children={"connect"}
					/>

					<RenderButtonOnTheRight
						group={group}
						children={Cart()}
					/>
				</div>
			</section>
		</>
	);
}

function RenderNavLinks({ group }: commonProps): JSX.Element {
	let link: JSX.Element[];

	link = NAVIGATION_LINKS.map((item: navigationLink, index: number) => {
		return (
			<li key={index}>
				<Link href={item.url}>{item.title}</Link>
			</li>
		);
	});

	return (
		<nav className={`${group}__left`}>
			<ul>{link}</ul>
		</nav>
	);
}

function RenderButtonOnTheRight({
	group,
	children,
}: RenderButtonOnTheRightProps): JSX.Element {
	const { open } = useWeb3Modal();

	function handleClick() {
		if (children === "connect") {
			open();
		}
	}

	return (
		<>
			<button
				className={`${group}__right-button`}
				onClick={() => handleClick()}
			>
				{typeof children === "string" ? (
					<span>{children}</span>
				) : (
					<i>{children}</i>
				)}
			</button>
		</>
	);
}
