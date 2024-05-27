"use client"
import "./index.scss";

import { ArrowDeg90, Polygon, Xexadons } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
import { ContextWrapper } from "@/hooks";
import { JsonRpcSigner } from 'ethers';
import { buyNFT, sellNFT } from "@/utils/app";

type purchaseNftProps = commonProps & {
	activeTab: string;
};

type contentProps = purchaseNftProps & {
	signer: JsonRpcSigner | undefined,
	userAddress: string,
	_chainId: number
};

export function PurchaseNft({ group, activeTab, signer, userAddress, _chainId }: contentProps) {
	return (
		<section className={group}>
			<>{renderTitle({ group, activeTab })}</>
			<>{renderContent({ group, activeTab, signer, userAddress, _chainId })}</>
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

function renderContent({ group, activeTab, signer, userAddress, _chainId }: contentProps) {
	return (
		<section className={`${group}__content`}>
			<>
				{contentWrapper({
					children: renderTopContent({ group, activeTab }),
				})}
			</>

			<>
				{contentWrapper({
					children: renderBottomContent({ group, activeTab, signer, userAddress, _chainId }),
				})}
			</>
		</section>
	);
}

function renderTopContent({ group, activeTab }: purchaseNftProps) {

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

						<span>{selectedNFTs.length} xexadons</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__price ${activeTab}`}>
						<span>{selectedNFTs.length} xexadons</span>

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

function renderBottomContent({ group, activeTab, signer, userAddress, _chainId }: contentProps) {
	const {
		nftContext: { selectedNFTs, buyAmount, sellAmount },
	} = ContextWrapper();

	const buyNFTs = async() => {
        await buyNFT(selectedNFTs, _chainId, signer);
        console.log("successfully");
    }

	const sellNFTs = async() => {
        await sellNFT(selectedNFTs, selectedNFTs[0].address, _chainId, signer);
        console.log("successfully");
    }

	function handleProceed() {
        if (activeTab === "buy") {
            buyNFTs();
        } else if (activeTab === "sell") {
            sellNFTs();
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
							{/* <span>{add}</span> */}
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
							<i>{Polygon()}</i>
							<span>{buyAmount} matic</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>{Xexadons()}</i>
							<span>{selectedNFTs.length} xexadons</span>
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>{Xexadons()}</i>
							<span>{selectedNFTs.length} xexadons</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>{Polygon()}</i>
							<span>{sellAmount} matic</span>
						</span>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<p className={`${group}__description`}>
						~swap {buyAmount} matic <i>{Polygon()}</i> for {selectedNFTs.length} xexadons
					</p>
				</>
			) : (
				<>
					<p className={`${group}__description`}>
						~swap {selectedNFTs.length} xexadons for {sellAmount} matic <i></i>
					</p>
				</>
			)}

			<article className={`${group}__confirmation`}>
				<button onClick={handleProceed}>proceed</button>
			</article>
		</div>
	);
}
