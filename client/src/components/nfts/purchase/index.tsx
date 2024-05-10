import "./index.scss";

import { commonProps } from "@/types";
import { contentWrapper } from "@/views";

type purchaseNftProps = commonProps & {
	activeTab: string;
};

export function PurchaseNft({ group, activeTab }: purchaseNftProps) {
	// const styleClass: string = `${activeTab}-content`;

	return (
		<section className={group}>
			<>{renderTitle({ group, activeTab })}</>
			<>{renderContent({ group, activeTab })}</>
		</section>
	);
}

function renderTitle({ group, activeTab }: purchaseNftProps) {
	let text: string | null = "";

	switch (activeTab) {
		case "buy":
			text = `~ select nft you wish to buy from the collection and proceed to swap`;
			break;

		case "sell":
			text = `~ select nft you wish to sell from your wallet, proceed to swap to token`;
			break;
	}

	return (
		<section className={`${group}__title`}>
			<h2>swap</h2>

			<p>{text}</p>
		</section>
	);
}

function renderContent({ group, activeTab }: purchaseNftProps) {
	return (
		<section className={`${group}__content`}>
			<>
				{contentWrapper({
					children: renderTopContent({ group, activeTab }),
				})}
			</>

			<>
				{contentWrapper({
					children: renderBottomContent({ group, activeTab }),
				})}
			</>
		</section>
	);
}

function renderTopContent({ group, activeTab }: purchaseNftProps) {
	return (
		<div className={`${group}__content-top`}>
			<article className={`${group}__from-to`}>
				<span>from</span>
				<span>to</span>
			</article>

			{group.includes("buy") ? (
				<>
					<article className={`${group}__price`}>
						<div>
							<span>690</span>
							<span>$800</span>
						</div>

						<i>icon</i>

						<span>3 xexadons</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__price ${activeTab}`}>
						<span>3 xexadons</span>

						<i>icon</i>

						<div>
							<span>690</span>
							<span>$800</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
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
				</>
			) : (
				<>
					<article className={`${group}__currency`}>
						<span>
							<i>icon</i>
							<span>xexadons</span>
						</span>

						<span>
							<i>icon</i>
							<span>polygon</span>
						</span>
					</article>
				</>
			)}
		</div>
	);
}

function renderBottomContent({ group, activeTab }: purchaseNftProps) {
	return (
		<div className={`${group}__content-bottom`}>
			{group.includes("buy") ? (
				<>
					<article className={`${group}__detail`}>
						<div className={`${group}__detail-1`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-2`}>
							<span>nft pool</span>
							<span>receiver</span>
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
				</>
			) : (
				<>
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

						<div className={`${group}__detail-3 ${activeTab}`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-4`}>
							<span>account</span>
							<span>account</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
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
				</>
			) : (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>icon</i>
							<span>3 xexadons</span>
						</span>

						<i>icon</i>

						<span>
							<i>icon</i>
							<span>690 matic</span>
						</span>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<p className={`${group}__description`}>
						~swap 690 matic <i></i> for 3 xexadons
					</p>
				</>
			) : (
				<>
					<p className={`${group}__description`}>
						~swap 3 xexadons for 690 matic <i></i>
					</p>
				</>
			)}

			<article className={`${group}__confirmation`}>
				<button>proceed</button>
			</article>
		</div>
	);
}
