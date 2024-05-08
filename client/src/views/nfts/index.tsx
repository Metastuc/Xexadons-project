import "./index.scss";

import { ReactNode } from "react";

import { BuyLeftContent,Tabs } from "@/components";

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
			content = BuyLeftContent();
			break;

		case "sell":
			content = <div>sell</div>;
			break;

		case "pool":
			content = <div>pool</div>;
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
