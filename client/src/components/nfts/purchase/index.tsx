import "./index.scss";

import { useAccount } from "wagmi";

import { ArrowDeg90, BNB, Polygon, Xexadons } from "@/assets";
import { ContextWrapper } from "@/hooks";
import { buyNFT, getCurrency, sellNFT, useEthersSigner } from "@/lib";
import { commonProps } from "@/types";
import { truncateWalletAddress } from "@/utils";
import { contentWrapper } from "@/views";

type purchaseNftProps = commonProps & {
	activeTab: string;
};

export function PurchaseNft({ group, activeTab }: purchaseNftProps) {
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
					children: (
						<RenderTopContent
							group={group}
							activeTab={activeTab}
						/>
					),
				})}
			</>

			<>
				{contentWrapper({
					children: (
						<RenderBottomContent
							group={group}
							activeTab={activeTab}
						/>
					),
				})}
			</>
		</section>
	);
}

function RenderTopContent({ group, activeTab }: purchaseNftProps) {
	const {
		nftContext: { selectedNFTs, buyAmount, sellAmount, dollarAmount },
	} = ContextWrapper();

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
							<span>{buyAmount}</span>
							<span>${dollarAmount}</span>
						</div>

						<i>{ArrowDeg90()}</i>

						<span>
							{selectedNFTs.length} xexadon
							{selectedNFTs.length === 1 ? "" : "s"}
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__price ${activeTab}`}>
						<span>
							{selectedNFTs.length} xexadon
							{selectedNFTs.length === 1 ? "" : "s"}
						</span>

						<i>{ArrowDeg90()}</i>

						<div>
							<span>{sellAmount}</span>
							<span>${dollarAmount}</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<article className={`${group}__currency`}>
						<span>
							<i>{Polygon()}</i>
							<span>polygon</span>
						</span>

						<span>
							<i>{Xexadons()}</i>
							<span>xexadons</span>
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__currency`}>
						<span>
							<i>{Xexadons()}</i>
							<span>xexadons</span>
						</span>

						<span>
							<i>{Polygon()}</i>
							<span>polygon</span>
						</span>
					</article>
				</>
			)}
		</div>
	);
}

function RenderBottomContent({ group, activeTab }: purchaseNftProps) {
	const { chainId, address } = useAccount();
	const signer = useEthersSigner();

	const {
		nftContext: { buyAmount, selectedNFTs, sellAmount },
	} = ContextWrapper();

	const userAddress: string =
		address === undefined ? "account" : truncateWalletAddress(address);

	const chain: number = chainId === undefined ? 80002 : chainId;

	async function handlePurchase() {
		switch (true) {
			case activeTab === "buy":
				await buyNFT(selectedNFTs, chain, signer);
				break;

			case activeTab === "sell":
				await sellNFT(selectedNFTs, selectedNFTs[0].address, chain, signer);
				break;
		}
	}

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
							<span>router</span>
							<span>receiver</span>
						</div>

						<div className={`${group}__detail-3`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-4`}>
							<span>0xe9c...26Ca</span>
							<span>{userAddress}</span>
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
							<span>0xe9c...26Ca</span>
							<span>{userAddress}</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>
								{chain === 97 ? (
									<BNB />
								) : chain === 80002 ? (
									<Polygon />
								) : (
									<span className="text-xs">Wrong network</span>
								)}
							</i>
							<span className="text-nowrap">
								{buyAmount} {getCurrency(chain)}
							</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>{Xexadons()}</i>
							<span className="text-nowrap">
								{selectedNFTs.length} xexadons
							</span>
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>{Xexadons()}</i>
							<span className="text-nowrap">
								{selectedNFTs.length} xexadons
							</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>
								{chain === 97 ? (
									<BNB />
								) : chain === 80002 ? (
									<Polygon />
								) : (
									<span className="text-xs">Wrong network</span>
								)}
							</i>
							<span className="text-nowrap">
								{sellAmount} {getCurrency(chain)}
							</span>
						</span>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<p className={`${group}__description`}>
						~swap {buyAmount} {getCurrency(chain)}{" "}
						<i>
							{chain === 97 ? (
								<BNB />
							) : chain === 80002 ? (
								<Polygon />
							) : (
								<span className="text-xs">Wrong network</span>
							)}
						</i>{" "}
						for {selectedNFTs.length} xexadons
					</p>
				</>
			) : (
				<>
					<p className={`${group}__description`}>
						~swap {selectedNFTs.length} xexadons for {sellAmount}{" "}
						{getCurrency(chain)}{" "}
						<i>
							{chain === 97 ? (
								<BNB />
							) : chain === 80002 ? (
								<Polygon />
							) : (
								<span className="text-xs">Wrong network</span>
							)}
						</i>
					</p>
				</>
			)}

			<article className={`${group}__confirmation`}>
				<button onClick={handlePurchase}>proceed</button>
			</article>
		</div>
	);
}
