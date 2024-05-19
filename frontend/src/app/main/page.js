"use client"
// import { useRoutefr } from 'next/navigation';
import Buy from "@/components/main/buy";
import Nft from "@/components/main/nft";
import Pool from "@/components/main/pool";
import Sell from "@/components/main/sell";
import Button from "@/components/ui/button";
import Tabs from "@/components/ui/tabs";
import { useAccount } from "wagmi";
import TokenTag from "@/components/ui/tokenTag";
import { fetchPrice, getAppAddress } from "@/utils/app";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MainPage() {
    const { isConnected, chainId } = useAccount();
    const [selectedNfts, setSelectedNfts] = useState([]);
    const [selectedSellNfts, setSelectedSellNfts] = useState([]);
    const [selectedAddNfts, setSelectedAddNfts] = useState([]);
    const [collectionName, setCollectionName] = useState(" ");
    const [buyAmount, setBuyAmount] = useState(" ");
    const [sellAmount, setSellAmount] = useState(" ");
    const [addAmount, setAddAmount] = useState(" ");
    const [dollarAmount, setDollarAmount] = useState(0);

    const [nftIcon, setNFTIcon] = useState("/xexadons.png");
    
    const [ activeTab, setActiveTab ] = useState(0);
    const [ poolTab, setPoolTab ] = useState(0);
    const [ xexadonAddress, setXexadonAddress ] = useState("0x64dCb39317940d74b711eCE72595b6a80D37B8ad")

    const tabOptions = ["Buy", "Sell", "Pool"];

    useEffect(() => {
        if (isConnected) {
            (async () => {
                const address = getAppAddress(chainId);
                setXexadonAddress(address);
            })();
        }
    }, [isConnected, activeTab]);

    return (
        <div className="w-full flex justify-center items-center container mx-auto px-20 py-24">
            <div className="gradient-border-bg p-8 flex gap-6 rounded-lg w-full">
                <div className="rounded-xl p-6 w-1/2 border bg-white/5">
                    <div className="w-fit ml-auto mb-8">
                        <Tabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            setPool={setPoolTab}
                            options={tabOptions}
                        />
                    </div>
                    {
                        activeTab === 0 
                        ? <Buy selectedNfts={selectedNfts} collectionName={collectionName} buyAmount={buyAmount} dollarAmount={dollarAmount} nftIcon={nftIcon} />
                        : activeTab === 1
                        ? <Sell selectedNFTs={selectedSellNfts} collectionName={collectionName} nftIcon={nftIcon} sellAmount={sellAmount} dollarAmount={dollarAmount} collectionAddress={xexadonAddress}/>
                        : activeTab === 2
                        ? <Pool setPoolTab={setPoolTab} addAmount={addAmount} dollarAmount={dollarAmount} />
                        : null
                    }
                </div>

                <div className="w-1/2">
                    <Nft activeTab={activeTab} collectionAddress={xexadonAddress} selectedNfts={selectedNfts} setSelectedNfts={setSelectedNfts} selectedSellNfts={selectedSellNfts} setSelectedSellNfts={setSelectedSellNfts} selectedAddNfts={selectedAddNfts} setSelectedAddNfts={setSelectedAddNfts} setCollectionName={setCollectionName} setBuyAmount={setBuyAmount} setSellAmount={setSellAmount} setAddAmount={setAddAmount} setDollarAmount={setDollarAmount} setNFTIcon={setNFTIcon} poolTab={poolTab} />
                </div>
            </div>
        </div>
    );
}