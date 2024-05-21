"use client"
import { nftData } from "@/data/nftData";
import NftCard from "./nftCard";
import { useAccount } from "wagmi";
import { fetchPrice, getChainIcon, getCoinPrice, getCollection, getSellPrice, getAddAmount, getUserCollectionNFTs } from "@/utils/app";
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { useEthersSigner } from "@/utils/adapter";
// call get collection function
// pool number and nfts(user NFTs if it sell, collection nfts if it is buy)

export default function Nft({ activeTab, collectionAddress, selectedNfts, setSelectedNfts, selectedSellNfts, setSelectedSellNfts, selectedAddNfts, setSelectedAddNfts, setCollectionName, setBuyAmount, setSellAmount, setAddAmount, setDollarAmount, setNFTIcon, poolTab }) {
    const { address, isConnected, chainId } = useAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [poolCount, setpoolCount] = useState(0);
    const [pools, setPools] = useState([]);
    const [buyPrices, setBuyPrices] = useState({});
    const [nfts, setNFTs] = useState([]);
    const [coinPrice, setCoinPrice] = useState(0);
    const signer = useEthersSigner();

    useEffect(() => {
        if (isConnected) {
          (async () => {
            const coinPrice = await getCoinPrice(chainId);
            console.log(coinPrice);
            setCoinPrice(coinPrice);
            if (activeTab === 0) {
                const response = await getCollection(chainId, collectionAddress);
                const result = await response.json();
                const nfts = result.NFTs;
                console.log(result);
                setpoolCount(result.pools.length);
                setNFTs(result.NFTs);
                const buyPrices = nfts.reduce((acc, nft) => {
                    const key = nft.poolAddress;
                    const price = parseFloat(nft.price);
                    acc[key] = price;
                    return acc;
                }, {});
                console.log(buyPrices);
                setBuyPrices(buyPrices);
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
                const response = await getUserCollectionNFTs(chainId, collectionAddress, address);
                const result = await response.json();
                setpoolCount(0);
                setNFTs(result.nfts);
                console.log(result.nfts);
                // setPools(result.pools);
                setNFTIcon(result.icon);
                setIsLoading(false);
                // if (poolTab === 0) {
                //     console.log(poolTab);
                //     const response = await getUserCollectionNFTs(chainId, collectionAddress, address);
                //     const result = await response.json();
                //     setpoolCount(0);
                //     setNFTs(result.nfts);
                //     setCollectionName(result.NFTs[0].name);
                //     // setPools(result.pools);
                //     setNFTIcon(result.icon);
                //     setIsLoading(false);
                // } else {
                //     console.log(poolTab);
                //     const response = await getCollection(chainId, collectionAddress);
                //     const result = await response.json();
                //     setpoolCount(result.pools.length);
                //     setNFTs(result.NFTs);
                //     setCollectionName(result.NFTs[0].name);
                //     setPools(result.pools);
                //     setNFTIcon(result.icon);
                //     setIsLoading(false);
                // }
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
            const poolPrices = pools.reduce((acc, pool) => {
                const C = selectedNfts.filter(nft => nft.poolAddress === pool.poolAddress);
                const _next_price = (pool.reserve1 * C.length) / (pool.reserve0 - C.length);
                const next_price = formatEther(_next_price);
                acc[pool.poolAddress] = next_price;
                return acc;
            }, {});
            console.log(poolPrices);
            const newTotalAmountIn = formatEther(_newTotalAmountIn);
            const dollarAmount = coinPrice * newTotalAmountIn;
            setBuyAmount(newTotalAmountIn);
            setDollarAmount(dollarAmount);
            setBuyPrices(poolPrices);
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
            const _sellAmount = formatEther(sellAmount);
            const dollarAmount = coinPrice * _sellAmount;
            setSellAmount(_sellAmount);
            setDollarAmount(dollarAmount);
            }
        };
    
        calculateSellAmount();
    }, [isConnected, selectedSellNfts]);

    useEffect(() => {
        const calculateAddAmount = async () => {
            if (isConnected) {
            let addAmount = 0;
            if (selectedAddNfts.length > 0) {
                const amount = await getAddAmount(selectedAddNfts.length, chainId); // should take in the pool address as well
                addAmount = amount;
            }
            const _addAmount = formatEther(addAmount);
            const dollarAmount = coinPrice * _addAmount;
            setAddAmount(_addAmount);
            setDollarAmount(dollarAmount);
            }
        };
    
        calculateAddAmount();
    }, [isConnected, selectedAddNfts]);

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
                                <NftCard details={nft} key={id} selectedNfts={selectedNfts} setSelectedNfts={setSelectedNfts} selectedSellNfts={selectedSellNfts} setSelectedSellNfts={setSelectedSellNfts} selectedAddNfts={selectedAddNfts} setSelectedAddNfts={setSelectedAddNfts} buyPrices={buyPrices} activeTab={activeTab}/>
                            )
                        })
                    }
                </div>
            </div>
            )}
        </div>
    );
}