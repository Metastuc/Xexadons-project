import "./index.scss";

import { ReactNode } from "react";

import { Pool, PurchaseNft, Tabs } from "@/components";

type renderLeftContentProps = {
	activeTab: string;
	handleTabClick: (tab: string) => void;
	tabIsActive: (tab: string) => "active" | null;
};

type renderRightContentProps = {
	activeTab: string;
	renderTabContent: () => ReactNode;
};

export function renderLeftContent({
	activeTab,
	handleTabClick,
	tabIsActive,
}: renderLeftContentProps) {
	let content: ReactNode;

	/*eslint indent: ["error", tab, { "SwitchCase": 1 }]*/
	switch (activeTab) {
		case "buy":
			content = PurchaseNft({ group: "buy_left", activeTab: "buy" });
			break;

		case "sell":
			content = PurchaseNft({ group: "sell_left", activeTab: "sell" });
			break;

		case "liquidity":
			content = <>liquidity</>;
			break;

		case "create":
			content = <>create</>;
			break;
	}

	return (
		<section className="nfts__content">
			<Tabs handleTabClick={handleTabClick} />
			<section className="glass background">{content}</section>
		</section>
	);
}

export function renderRightContent({
	activeTab,
	renderTabContent,
}: renderRightContentProps) {
	return <section className="nfts__content">{renderTabContent()}</section>;
}

export function contentWrapper({
	group,
	children,
}: {
	group: string;
	children: ReactNode;
}) {
	return (
		<section className={`${group}__content-wrapper`}>{children}</section>
	);
}
