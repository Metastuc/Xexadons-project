"use client";

import { ReactNode, useEffect } from "react";

import { PurchaseNFTRight } from "@/components/nfts/purchase/right";
import { ContextWrapper, useTabSwitcher } from "@/hooks";
import { GlassyBackground, renderLeftContent, renderRightContent } from "@/views";

type activeTabProps = Record<string, ReactNode>;

export default function NFTs() {
	const { activeTab, handleTabClick, tabIsActive } = useTabSwitcher("create");

	const activeTabContent: activeTabProps = {
		buy: (
			<PurchaseNFTRight
				group="buy_right"
				activeTab={activeTab}
			/>
		),
		sell: (
			<PurchaseNFTRight
				group="sell_right"
				activeTab={activeTab}
			/>
		),
		liquidity: (
			<PurchaseNFTRight
				group="deposit_right"
				activeTab={activeTab}
			/>
		),
		withdraw: (
			<PurchaseNFTRight
				group="withdraw_right"
				activeTab={activeTab}
			/>
		),
		create: <>create</>,
	};

	function renderTabContent(): ReactNode {
		return activeTabContent[activeTab] || null;
	}

	const {
		nftContext: { setSelectedNFTs },
	} = ContextWrapper();

	useEffect(() => {
		setSelectedNFTs([]);
	}, [activeTab, setSelectedNFTs]);

	return (
		<>
			<div className="nfts__wrapper">
				<GlassyBackground
					background="#231926"
					color1="#DED620"
					color2="#B2FDB6"
					deg={145}
				>
					{renderLeftContent({
						activeTab,
						handleTabClick,
						tabIsActive,
					})}
					{renderRightContent({ renderTabContent })}
				</GlassyBackground>
			</div>
		</>
	);
}
