import localFont from "next/font/local";
import "./globals.css";
import BlurLayout from "@/components/ui/blurLayout";
import Navbar from "@/components/ui/navbar";
import Sparkles from "@/components/ui/sparkles";
require('dotenv').config();

import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'wagmi';
import Script from "next/script";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  bitgetWallet,
  metaMaskWallet,
  trustWallet
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  bsc
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet, bitgetWallet, trustWallet],
    },
  ],
  {
    appName: 'Xexadon',
    projectId: process.env.PROJECT_ID,
  }
);

const config = createConfig({
  chains: [bsc],
  connectors,
  ssr: true, 
  transports: {
    [bsc.id]: http('https://bsc-dataseed1.binance.org/'),
  },
})

const client = new QueryClient();


export const metadata = {
  title: "Xexadons",
  description: "NFT Market pllace",
};

const clashDisplay = localFont({
    src: [
        {
            path: "../fonts/ClashDisplay-Variable.woff2",
            weight: "900",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Extralight.woff2",
            weight: "200",
            style: "normal",
        },
        
    ],
});

export default function RootLayout({ children }) {
  return (
      <html lang="en">
          <body className={`${clashDisplay.className} bg-main text-white`}>
              {/* <BlurLayout /> */}
              {/* <Sparkles> */}
              <WagmiProvider config={config}>
                <QueryClientProvider client={client}> 
                  <Navbar />
                  {children}
                </QueryClientProvider>
              </WagmiProvider>
              {/* </Sparkles> */}
          </body>
      </html>
  );
}
