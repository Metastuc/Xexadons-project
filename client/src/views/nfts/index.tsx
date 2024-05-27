import "./index.scss";

import { ReactNode } from "react";

import { Create, Liquidity, PurchaseNft, Tabs } from "@/components";

import { GlassyBackground } from "../reusable";

import { useEthersSigner } from "@/utils/adapter";
import { useAccount } from "wagmi";

type renderLeftContentProps = {
	activeTab: string;
	handleTabClick: Function;
	tabIsActive: Function;
};

type renderRightContentProps = {
	activeTab?: string;
	renderTabContent: () => ReactNode;
};

export function renderLeftContent({
	activeTab,
	handleTabClick,
}: renderLeftContentProps) {
	let content: ReactNode;
	let currentPool = activeTab == "liquidity" ? "deposit" : "withdraw";
	
	const signer = useEthersSigner();
	const { address, chainId, status } = useAccount();
	const userAddress = address?.slice(0, 6) + "..." + address?.slice(-3) || 'account';
	const _chainId = status === "connected" ? chainId : 80002;
	switch (activeTab) {
		case "buy":
			content = PurchaseNft({ group: "buy_left", activeTab: "buy", signer: signer, userAddress: userAddress, _chainId: _chainId });
			break;

		case "sell":
			content = PurchaseNft({ group: "sell_left", activeTab: "sell", signer: signer, userAddress: userAddress, _chainId: _chainId });
			break;

		case "liquidity":
		case "deposit":
		case "withdraw":
			content = Liquidity({
				group: "liquidity_left",
				activeTab: "liquidity",
				handleTabClick,
				currentPool,
				signer,
				userAddress,
				_chainId
			});
			break;

		case "create":
			content = Create({ group: "create_left" });
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

export function renderRightContent({
	renderTabContent,
}: renderRightContentProps) {
	return (
		<section className="nfts__content">
			<GlassyBackground>{renderTabContent()}</GlassyBackground>
		</section>
	);
}

export function contentWrapper({ children }: { children: ReactNode }) {
	return <section className={`nfts__content-wrapper`}>{children}</section>;
}