import "./index.scss";

import { NextOptimizedImage } from "@/components/reusable";
import { commonProps } from "@/types";
import { GlassyBackground } from "@/views";

export function Services({ group }: commonProps) {
	return (
		<section
			data-group="parent"
			className={`${group}`}
		>
			<div
				data-group="wrapper"
				className={`${group}__wrapper`}
			>
				<GlassyBackground
					background="#211724"
					color1="#DED620"
					color2="#B2FDB6"
					deg={144}
				>
					{renderTopContent({ group })}
					{renderBottomContent({ group })}
				</GlassyBackground>
			</div>
		</section>
	);
}

function renderTopContent({ group }: commonProps) {
	return (
		<>
			<h2 className={`${group}__title`}>
				<span>Buy, sell & trade</span>
				<div>
					<span>nfts</span>
					<span>instantly</span>
				</div>
			</h2>
		</>
	);
}

function renderBottomContent({ group }: commonProps) {
	return (
		<div className={`${group}__content`}>
			<div className={`${group}__left`}>
				<article>
					<b>buy-</b>
					<p>
						deposit token (Eth, Bsc, Matic, Avax, Ftm, Btc) add
						choice Nft to cart and buy instantly
					</p>
				</article>

				<article>
					<b>sell-</b>
					<p>
						deposit Nft to pool and sell instantly at current floor
						price for token
					</p>
				</article>

				<article>
					<b>trade-</b>
					<p>
						deposit both Nfts and token to pool and earn trading
						fees
					</p>
				</article>
			</div>

			<div className={`${group}__right`}>
				<span>
					<NextOptimizedImage
						src="/services.png"
						alt="services"
					/>
				</span>
			</div>
		</div>
	);
}
