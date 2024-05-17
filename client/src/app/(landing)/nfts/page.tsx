"use client";

import { ReactNode } from "react";

import { useTabSwitcher } from "@/hooks";
import {
	GlassyBackground,
	renderLeftContent,
	renderRightContent,
} from "@/views";

type activeTabProps = Record<string, ReactNode>;

export default function NFTs() {
	const { activeTab, handleTabClick, tabIsActive } = useTabSwitcher("create");

	const activeTabContent: activeTabProps = {
		buy: <>buy</>,
		sell: <>sell</>,
		liquidity: <>deposit</>,
		withdraw: <>withdraw</>,
		create: <>create</>,
	};

	function renderTabContent(): ReactNode {
		return activeTabContent[activeTab] || null;
	}

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
