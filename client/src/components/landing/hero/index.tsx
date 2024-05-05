import "./index.scss";

import Link from "next/link";
import { JSX } from "react";

import { commonProps } from "@/types";

export function Hero({ group }: commonProps): JSX.Element {
	return (
		<>
			<section
				className={group}
				data-group="parent"
			>
				<div
					className={`${group}__wrapper`}
					data-group={`wrapper`}
				>
					{renderLeftContent({ group })}
					{renderRightContent({ group })}
				</div>
			</section>
		</>
	);
}

function renderLeftContent({ group }: commonProps): JSX.Element {
	return (
		<>
			<div className={`${group}__left`}>
				<h1>
					<span>xexadons</span>
					<span>nft Marketplace</span>
				</h1>

				<p>
					Xexadons are sentient dinosaur-like creatures and are part
					of the society that revealed a formula that can transform
					time into a resource, known as XEX
				</p>

				<div>
					<Link href={"/"}>
						<span>enter app</span>
						<i>icon</i>
					</Link>
				</div>

				<article>
					<span>common--rare</span>
					<span>legendary--mythic</span>
				</article>
			</div>
		</>
	);
}

function renderRightContent({ group }: commonProps): JSX.Element {
	return (
		<>
			<div className={`${group}__right`}></div>
		</>
	);
}
