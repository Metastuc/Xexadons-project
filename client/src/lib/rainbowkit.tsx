"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
	darkTheme,
	getDefaultConfig,
	getDefaultWallets,
	RainbowKitProvider,
	WalletList,
} from "@rainbow-me/rainbowkit";
import {
	bitgetWallet,
	metaMaskWallet,
	trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { bsc, bscTestnet, mainnet, polygonAmoy } from "wagmi/chains";

import { WALLETCONNECT_ID } from "./constants";

const { wallets }: { wallets: WalletList } = getDefaultWallets();

const config = getDefaultConfig({
	appName: "Xexadons",
	chains: [mainnet, polygonAmoy, bscTestnet, bsc],
	projectId: WALLETCONNECT_ID,
	wallets: [
		...wallets,
		{
			groupName: "Recommended",
			wallets: [metaMaskWallet, bitgetWallet, trustWallet],
		},
	],
	ssr: true,
	transports: {
		// [polygonMumbai.id]: http(
		// 	`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
		// ),
	},
});

const queryClient: QueryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					initialChain={bscTestnet}
					theme={darkTheme()}
				>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
