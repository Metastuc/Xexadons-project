"use client"
// import { useRoutefr } from 'next/navigation';
import Buy from "@/components/main/buy";
import Nft from "@/components/main/nft";
import Pool from "@/components/main/pool";
import Sell from "@/components/main/sell";
import Button from "@/components/ui/button";
import Tabs from "@/components/ui/tabs";
import TokenTag from "@/components/ui/tokenTag";
import { fetchPrice } from "@/utils/app";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MainPage() {
    const [selectedNfts, setSelectedNfts] = useState([]);
    const [collectionName, setCollectionName] = useState(" ");
    const [buyAmount, setBuyAmount] = useState(" ");
    const [sellAmount, setSellAmount] = useState(" ");
    const [dollarAmount, setDollarAmount] = useState(0);

    const [nftIcon, setNFTIcon] = useState("/xexadons.png");
    
    const [ activeTab, setActiveTab ] = useState(0);
    const [ poolTab, setPoolTab ] = useState(0);

    const tabOptions = ["Buy", "Sell", "Pool"];
    const id = "0xb72b76b6cc05f142553bd50598cf9f31554236fb";

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
                        ? <Sell selectedNFTs={selectedNfts} collectionName={collectionName} nftIcon={nftIcon} sellAmount={sellAmount} collectionAddress={id}/>
                        : activeTab === 2
                        ? <Pool setPoolTab={setPoolTab} />
                        : null
                    }
                </div>

                <div className="w-1/2">
                    <Nft activeTab={activeTab} collectionAddress={id} selectedNfts={selectedNfts} setSelectedNfts={setSelectedNfts} setCollectionName={setCollectionName} setBuyAmount={setBuyAmount} setSellAmount={setSellAmount} setDollarAmount={setDollarAmount} setNFTIcon={setNFTIcon} poolTab={poolTab} />
                </div>
            </div>
        </div>
    );
}