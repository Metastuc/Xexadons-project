"use client";

import { ReactNode } from "react";

import { useTabSwitcher } from "@/hooks";
import { renderLeftContent, renderRightContent } from "@/views";

type activeTabProps = Record<string, ReactNode>;

export default function NFTs() {
	const { activeTab, handleTabClick, tabIsActive } = useTabSwitcher("buy");

	const activeTabContent: activeTabProps = {
		buy: <>buy</>,
		sell: <>sell</>,
		pool: <>pool</>,
	};

	function renderTabContent(): ReactNode {
		return activeTabContent[activeTab] || null;
	}

	return (
		<>
			<div className="nfts__wrapper">
				{renderLeftContent({ activeTab, handleTabClick, tabIsActive })}
				{renderRightContent({ activeTab, renderTabContent })}
			</div>
		</>
	);
}
