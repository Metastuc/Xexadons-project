import Image from "next/image";
import TokenTag from "../ui/tokenTag";
import { Icon } from "@iconify/react";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { getChainIcon, getUserBalance } from "@/utils/app";
import { useEthersSigner } from "@/utils/adapter";
import Button from "../ui/button";
import { formatEther } from "viem";

export default function Deposit({ addAmount, dollarAmount }) {
    const { address, isConnected, chain, chainId } = useAccount();
    const signer = useEthersSigner();
    const [userAddress, setUserAddress] = useState(" ");
    const [currency, setCurrency] = useState(" ");
    const [chainIcon, setChainIcon] = useState("/matic.png");
    const [userBalance, setUserBalance] = useState("0");

    useEffect(() => {
        if (isConnected) {
          (async () => {
            const add = address.slice(0, 6) + "..." + address.slice(-3);
            const icon = await getChainIcon(chainId);
            setCurrency(chain.nativeCurrency.name);
            setUserAddress(add);
            setChainIcon(icon);
            const balance = await getUserBalance(chainId, address);
            const userBalance = formatEther(balance);
            setUserBalance(userBalance);
          })();
        }
    }, [isConnected]);
    return (
        <div>
            <p className="text-[10px] mb-10">
                ~ when you deposit liquidity, you earn a 1% fee on each trade
                made on the pool
            </p>

            <p className="text-2xl mb-5">Add Liquidity</p>

            <div className="rounded-xl border border-gray border-dashed p-4 bg-white/5 mb-4">
                <p className="mb-4">Calculated deposit amount</p>
                <div className="flex justify-between mb-6">
                    <p className="text-xl">{addAmount}</p>
                    <TokenTag src="/matic.png" text="Polygon" />
                </div>
                <div className="flex justify-between text-xs">
                    <p>${dollarAmount}</p>
                    <p>{userBalance} {currency} available</p>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl border-dashed border border-grey py-5 flex justify-center">
                <div>
                    <div className="flex items-center space-x-4 mb-6 w-fit mx-auto ">
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-6 h-6 rounded-full border-[5px] border-[#98D076] bg-white"></div>
                            <div className="h-4 border border-dashed" />
                            <div className="w-6 h-6 rounded-full border-[5px] border-[#B06ECF] bg-white"></div>
                        </div>

                        <div>
                            <div className="flex space-x-3 text-xs items-center mb-5">
                                <p>user</p>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
                                {/* Replace with wallet addresss */}
                                <p>{userAddress}</p>
                            </div>

                            <div className="flex space-x-3 text-xs items-center">
                                <p>Nft Pool</p>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"></div>
                                {/* Replace with wallet addresss */}
                                <p>0x989849589</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start mb-5 w-full justify-center space-x-5">
                        <div className="flex flex-col items-center space-y-3">
                            <Image
                                src="/matic.png"
                                width="40"
                                height="40"
                                alt="Token icon"
                            />

                            {/* TODO: replace with actual figures */}
                            <p>690 Matic</p>
                        </div>
                        <div>
                            <Icon
                                icon="ei:arrow-right"
                                width="27"
                                height="27"
                                className="mt-4"
                            />
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <Image
                                src="/xexadons.png"
                                width="40"
                                height="40"
                                alt="Token icon"
                            />

                            {/* TODO: replace with actual figures */}
                            <p>3 xexadons</p>
                        </div>
                    </div>

                    <p className="mb-5">~deposit 690matic for 3 xexadons</p>
                    <div className="w-fit mx-auto">
                        <Button text="Proceed" />
                    </div>
                </div>
            </div>
        </div>
    );
}