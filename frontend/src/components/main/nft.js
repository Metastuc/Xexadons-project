"use client"
import { nftData } from "@/data/nftData";
import NftCard from "./nftCard";
import { useAccount } from "wagmi";
import { fetchPrice, getChainIcon, getCollection, getSellPrice, getUserCollectionNFTs } from "@/utils/app";
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { useEthersSigner } from "@/utils/adapter";
// call get collection function
// pool number and nfts(user NFTs if it sell, collection nfts if it is buy)

export default function Nft({ activeTab, collectionAddress, selectedNfts, setSelectedNfts, selectedSellNfts, setSelectedSellNfts, setCollectionName, setBuyAmount, setSellAmount, setDollarAmount, setNFTIcon, poolTab }) {
    const { address, isConnected, chainId } = useAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [poolCount, setpoolCount] = useState(0);
    const [pools, setPools] = useState([]);
    const [nfts, setNFTs] = useState([]);
    const signer = useEthersSigner();

    useEffect(() => {
        if (isConnected) {
          (async () => {
            if (activeTab === 0) {
                const response = await getCollection(chainId, collectionAddress);
                const result = await response.json();
                console.log(result);
                setpoolCount(result.pools.length);
                setNFTs(result.NFTs);
                setCollectionName(result.NFTs[0].name);
                setPools(result.pools);
                setNFTIcon(result.icon);
                setIsLoading(false);
            } else if(activeTab === 1) {
                const response = await getUserCollectionNFTs(chainId, collectionAddress, address);
                const result = await response.json();
                setpoolCount(0);
                setNFTs(result.nfts);
                console.log(result.nfts);
                setCollectionName(result.NFTs[0].name);
                // setPools(result.pools);
                setNFTIcon(result.icon);
                setIsLoading(false);
            } else {
                if (poolTab === 0) {
                    console.log(poolTab);
                    const response = await getUserCollectionNFTs(chainId, collectionAddress, address);
                    const result = await response.json();
                    setpoolCount(0);
                    setNFTs(result.nfts);
                    setCollectionName(result.NFTs[0].name);
                    // setPools(result.pools);
                    setNFTIcon(result.icon);
                    setIsLoading(false);
                } else {
                    console.log(poolTab);
                    const response = await getCollection(chainId, collectionAddress);
                    const result = await response.json();
                    setpoolCount(result.pools.length);
                    setNFTs(result.NFTs);
                    setCollectionName(result.NFTs[0].name);
                    setPools(result.pools);
                    setNFTIcon(result.icon);
                    setIsLoading(false);
                }
            }
          })();
        }
    }, [isConnected, activeTab]);

    useEffect(() => {
        const calculateBuyAmount = async () => {
            if (isConnected) {
            // Calculate total amountIn for all pools
            const _newTotalAmountIn = pools.reduce((sum, pool) => {
                const C = selectedNfts.filter(nft => nft.poolAddress === pool.poolAddress);
                return sum + ((pool.reserve1 * C.length) / (pool.reserve0 - C.length));
            }, 0);
            // const price = fetchPrice(chainId);
            // const dollarAmount = price * _newTotalAmountIn;
            const newTotalAmountIn = formatEther(_newTotalAmountIn);
            setBuyAmount(newTotalAmountIn);
            // setDollarAmount(dollarAmount);
            }
        };
    
        calculateBuyAmount();
    }, [isConnected, pools, selectedNfts]);

    useEffect(() => {
        const calculateSellAmount = async () => {
            if (isConnected) {
            let sellAmount = 0;
            if (selectedSellNfts.length > 0) {
                const price = await getSellPrice(selectedSellNfts.length, collectionAddress, chainId)
                sellAmount = price;
            }
            setSellAmount(sellAmount);
            // setDollarAmount(dollarAmount);
            }
        };
    
        calculateSellAmount();
    }, [isConnected, selectedSellNfts.length]);

    return (
        <div>
            {isLoading ? (
                        <div className="rounded-xl p-6 border bg-white/5">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-2xl">Select Nfts</h3>
                            <button className="bg-white/35 rounded-2xl items-center flex px-4 space-x-2 h-[2rem]">
                                <p>Pools</p>
                                {/* Replace with actual number of pools */}
                                <p className="h-6 w-6 bg-white text-black rounded-full">
                                    ...
                                </p>
                            </button>
                        </div>
            
                        {/* list of available nfts */}
                        <div className="grid grid-cols-3 gap-4">
                            {
                                nftData.map((data, id) => {
                                    return (
                                        <NftCard details={data} key={id} />
                                    )
                                })
                            }
                        </div>
                    </div>
            ) : (
                <div className="rounded-xl p-6 border bg-white/5">
                <div className="flex justify-between mb-6">
                    <h3 className="text-2xl">Select Nfts</h3>
                    <button className="bg-white/35 rounded-2xl items-center flex px-4 space-x-2 h-[2rem]">
                        <p>Pools</p>
                        {/* Replace with actual number of pools */}
                        <p className="h-6 w-6 bg-white text-black rounded-full">
                            {poolCount}
                        </p>
                    </button>
                </div>
    
                {/* list of available nfts */}
                <div className="grid grid-cols-3 gap-4">
                    {
                        nfts.map((nft, id) => {
                            return (
                                <NftCard details={nft} key={id} selectedNfts={selectedNfts} setSelectedNfts={setSelectedNfts} selectedSellNfts={selectedSellNfts} setSelectedSellNfts={setSelectedSellNfts} activeTab={activeTab}/>
                            )
                        })
                    }
                </div>
            </div>
            )}
        </div>
    );
}