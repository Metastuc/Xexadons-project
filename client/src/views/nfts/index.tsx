import "./index.scss";

import { ReactNode } from "react";

import { Create, Liquidity, PurchaseNft, Tabs } from "@/components";

import { GlassyBackground } from "../reusable";

type renderLeftContentProps = {
	activeTab: string;
	handleTabClick: Function;
	tabIsActive: Function;
};

type renderRightContentProps = {
	activeTab?: string;
	renderTabContent: () => ReactNode;
};

export function renderLeftContent({ activeTab, handleTabClick }: renderLeftContentProps) {
	let content: ReactNode;
	let currentPool = activeTab == "liquidity" ? "deposit" : "withdraw";

	switch (activeTab) {
		case "buy":
			content = PurchaseNft({ group: "buy_left", activeTab: "buy" });
			break;

		case "sell":
			content = PurchaseNft({ group: "sell_left", activeTab: "sell" });
			break;

		case "liquidity":
		case "deposit":
		case "withdraw":
			content = (
				<Liquidity
					group="liquidity_left"
					handleTabClick={handleTabClick}
					currentPool={currentPool}
					activeTab="liquidity"
				/>
			);
			break;

		case "create":
			content = <Create group="create_left" />;
			break;
	}

	return (
		<section className="nfts__content">
			<GlassyBackground>
				<Tabs
					handleTabClick={handleTabClick}
					activeTab={activeTab}
				/>
				<section className="glass background">{content}</section>
			</GlassyBackground>
		</section>
	);
}

export function renderRightContent({ renderTabContent }: renderRightContentProps) {
	return (
		<section className="nfts__content">
			<GlassyBackground>{renderTabContent()}</GlassyBackground>
		</section>
	);
}

export function contentWrapper({ children }: { children: ReactNode }) {
	return <section className={`nfts__content-wrapper`}>{children}</section>;
}
