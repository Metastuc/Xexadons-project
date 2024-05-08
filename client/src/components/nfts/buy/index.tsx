import "./index.scss";

import { ReactNode } from "react";

import { commonProps } from "@/types";

type contentWrapperProps = commonProps & {
	children: ReactNode;
};

export function BuyLeftContent() {
	const group = "buy_left";

	return (
		<section className="buy_left">
			<>{renderTitle({ group })}</>
			<>{renderContent({ group })}</>
		</section>
	);
}

function renderTitle({ group }: commonProps) {
	return (
		<section className={`${group}__title`}>
			<h2>swap</h2>

			<p>
				~ select nft you wish to buy from the collection and proceed to
				swap
			</p>
		</section>
	);
}

function contentWrapper({ group, children }: contentWrapperProps) {
	return (
		<section className={`${group}__content-wrapper`}>{children}</section>
	);
}

function renderContent({ group }: commonProps) {
	return (
		<section className={`${group}__content`}>
			<>
				{contentWrapper({
					group,
					children: renderTopContent({ group }),
				})}
			</>

			<>
				{contentWrapper({
					group,
					children: renderBottomContent({ group }),
				})}
			</>
		</section>
	);
}

function renderTopContent({ group }: commonProps) {
	return (
		<div className={`${group}__content-top`}>
			<article className={`${group}__from-to`}>
				<span>from</span>
				<span>to</span>
			</article>

			<article className={`${group}__price`}>
				<div>
					<span>690</span>
					<span>$800</span>
				</div>

				<i>icon</i>

				<span>3 xexadons</span>
			</article>

			<article className={`${group}__currency`}>
				<span>
					<i>icon</i>
					<span>polygon</span>
				</span>

				<span>
					<i>icon</i>
					<span>xexadons</span>
				</span>
			</article>
		</div>
	);
}

function renderBottomContent({ group }: commonProps) {
	return (
		<div className={`${group}__content-bottom`}>
			<article className={`${group}__detail`}>
				<div className={`${group}__detail-1`}>
					<span></span>
					<i></i>
					<span></span>
				</div>

				<div className={`${group}__detail-2`}>
					<span>from</span>
					<span>nft pool</span>
				</div>

				<div className={`${group}__detail-3`}>
					<span></span>
					<i></i>
					<span></span>
				</div>

				<div className={`${group}__detail-4`}>
					<span>account</span>
					<span>account</span>
				</div>
			</article>

			<article className={`${group}__swap`}>
				<span>
					<i>icon</i>
					<span>690 matic</span>
				</span>

				<i>icon</i>

				<span>
					<i>icon</i>
					<span>3 xexadons</span>
				</span>
			</article>

			<p className={`${group}__description`}>
				swap 690 matic <i>icon</i> for 3 xexadons
			</p>

			<article className={`${group}__confirmation`}>
				<button>proceed</button>
			</article>
		</div>
	);
}
