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
import { http, WagmiProvider } from "wagmi";
import { mainnet, polygonAmoy } from "wagmi/chains";

const { wallets }: { wallets: WalletList } = getDefaultWallets();

const config = getDefaultConfig({
	appName: "Xexadons",
	chains: [mainnet, polygonAmoy],
	projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
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
				<RainbowKitProvider theme={darkTheme()}>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
