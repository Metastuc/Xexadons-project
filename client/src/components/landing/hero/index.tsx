import "./index.scss";

import Link from "next/link";
import { JSX } from "react";

import { ArrowDeg45, HeroRightImage } from "@/assets";
import { ContextWrapper } from "@/hooks";
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
					<RenderLeftContent group={group} />
					<RenderRightContent group={group} />
				</div>
			</section>
		</>
	);
}

function RenderLeftContent({ group }: commonProps): JSX.Element {
	const {
		navContext: { setActiveTab },
	} = ContextWrapper();

	return (
		<>
			<div className={`${group}__left`}>
				<h1>
					<span>xexadons</span>
					<span>nft Marketplace</span>
				</h1>

				<p>
					Xexadons are sentient dinosaur-like creatures and are part of the
					society that revealed a formula that can transform time into a
					resource, known as XEX
				</p>

				<div>
					<Link
						href={"/nfts"}
						onClick={() => setActiveTab("buy")}
					>
						<span>enter app</span>
						<span>
							<i>{ArrowDeg45()}</i>
						</span>
					</Link>
				</div>

				<article>
					<span>common---rare</span>
					<span>legendary---mythic</span>
				</article>
			</div>
		</>
	);
}

function RenderRightContent({ group }: commonProps): JSX.Element {
	return (
		<>
			<div className={`${group}__right`}>
				<HeroRightImage />
			</div>
		</>
	);
}
