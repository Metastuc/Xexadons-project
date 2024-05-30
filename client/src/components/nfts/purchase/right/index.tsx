import "./index.scss";

import { JSX, ReactNode, useEffect } from "react";

import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";
import { getNFTCollections, getUserCollectionNFTs } from "@/api";
import { useAccount, useBalance } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { getCoinPrice, getSellPrice, getDepositAmount, getCurrency } from "@/utils/app";
import { formatEther } from "viem";

type PurchaseNFTRightProps = commonProps & {
	activeTab: string;
};

export function PurchaseNFTRight({ group, activeTab }: PurchaseNFTRightProps) {
	let content: JSX.Element | null = null;

	const { address, chainId, status } = useAccount();
	
	const _chainId = status === "connected" ? chainId : 80002;

	const {
		nftContext: { selectedNFTs, pools, setBuyAmount, setSellAmount, setDollarAmount, setDepositAmount, buyPrices, setBuyPrices, nextSellPrice, setNextSellPrice, poolAddress, setUserBalance },
	} = ContextWrapper();

	interface PoolPrice {
		poolAddress: string;
		nextPrice: string;
	}

	useEffect(() => {		
        const getUserBalamce = async () => {
						
            setUserBalance(0);
        };
			getUserBalamce();
    }, []);

	useEffect(() => {
        const calculateBuyAmount = async () => {
            // Calculate total amountIn for all pools
            const newTotalAmountIn = pools.reduce((sum, pool) => {
                const C = selectedNFTs.filter(nft => nft.poolAddress === pool.poolAddress);
                return sum + ((pool.reserve1 * C.length) / (pool.reserve0 - C.length));
            }, 0);
			const poolPrices: PoolPrice[] = pools.reduce((acc: PoolPrice[], pool) => {
				const C = selectedNFTs.filter(nft => nft.poolAddress === pool.poolAddress);
				const _next_price = Math.ceil(((pool.reserve1 * (C.length + 1)) / (pool.reserve0 - (C.length + 1))) * 100) / 100;
				const currency = getCurrency(_chainId);
				const next_price = (formatEther(BigInt(_next_price))) + currency;
			
				acc.push({
					poolAddress: pool.poolAddress,
					nextPrice: next_price
				});
			
				return acc;
			}, []);
			setBuyPrices(poolPrices);
			const _coinPrice = await getCoinPrice(_chainId);
			const coinPrice = Number(_coinPrice);
			const newTotalAmountIn_ = BigInt(newTotalAmountIn);
			const _newTotalAmountIn = formatEther(newTotalAmountIn_);
            const _dollarAmount = coinPrice * Number(_newTotalAmountIn);
			const amountIn = Math.ceil(Number(_newTotalAmountIn) * 100) / 100;
            setBuyAmount(amountIn);
			const dollarAmount = Math.ceil(_dollarAmount * 100) / 100;
            setDollarAmount(dollarAmount);
        };
		if (activeTab === "buy") {
			calculateBuyAmount();
		}
    }, [pools, selectedNFTs]);
	
    useEffect(() => {
        const calculateSellAmount = async () => {
            let sellAmount = 0;
			let nextAmount = 0;
            if (selectedNFTs.length > 0) {
                const price = await getSellPrice(selectedNFTs.length, selectedNFTs[0].address, _chainId)
				const _price = await getSellPrice((selectedNFTs.length) + 1, selectedNFTs[0].address, _chainId)
                sellAmount = price!== undefined? price : 0;
				if (_price!== undefined && price!== undefined && typeof _price === 'number' && typeof price === 'number') {
					nextAmount = _price - price;
				} else {
					nextAmount = 0;
				}
            }
            const _sellAmount = formatEther(BigInt(sellAmount));
			const _nextAmount = formatEther(BigInt(nextAmount));
			const _coinPrice = await getCoinPrice(_chainId);
			const coinPrice = Number(_coinPrice);
            const _dollarAmount = coinPrice * Number(_sellAmount);
			const amountOut = Math.floor(Number(_sellAmount) * 100) / 100;
			const currency = getCurrency(_chainId);
			const nextPrice = (Math.floor(Number(_nextAmount) * 100) / 100).toString() + currency;
            setSellAmount(amountOut);
			setNextSellPrice(nextPrice);
			const dollarAmount = Math.floor(_dollarAmount * 100) / 100;
            setDollarAmount(dollarAmount);
        };
		if (activeTab==="sell") {
			calculateSellAmount();
		}
    }, [selectedNFTs]);

	useEffect(() => {
        const calculateDepositAmount = async () => {
            let depositAmount = 0;
            if (selectedNFTs.length > 0) {
                const amount = await getDepositAmount(selectedNFTs.length, _chainId)
                depositAmount = amount!== undefined? amount : 0;
            }
            const _depositAmount = formatEther(BigInt(depositAmount));
			const _coinPrice = await getCoinPrice(_chainId);
			const coinPrice = Number(_coinPrice);
            const _dollarAmount = coinPrice * Number(_depositAmount);
			const amountIn = Math.ceil(Number(_depositAmount) * 100) / 100;
            setDepositAmount(amountIn);
			const dollarAmount = Math.ceil(_dollarAmount * 100) / 100;
            setDollarAmount(dollarAmount);
        };
    
        calculateDepositAmount();
    }, [selectedNFTs]);

	const {
		nftContext: { nftAddress, setCollection, setCollectionName },
	} = ContextWrapper();

	const {
		nftContext: { setPools },
	} = ContextWrapper();

	const {
		nftContext: { setSelectedNFTs },
	} = ContextWrapper();

	const queryFn = activeTab === "buy"
	? async () => getNFTCollections(_chainId, nftAddress) // handle error with display connect wallet
	: async () => getUserCollectionNFTs(_chainId, nftAddress, address?? '0x00000', poolAddress, activeTab);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["nftCollections", _chainId, nftAddress, activeTab], // Adding activeTab to queryKey to refetch on change
		queryFn: queryFn,
	});

	useEffect(() => {
		if (activeTab === "buy") {
			data && (setCollection(data), setCollectionName(data.NFTs[0].name));
		}
	}, [data, setCollection, setCollectionName]);

	useEffect(() => {
		if (activeTab === "buy") {
			data && (setPools(data.pools));	
		}
	}, [data, setPools]);

	function handleSelect(selectedNFT: { address: string, id: number; poolAddress: string }) {
		setSelectedNFTs((previous) => {
			const exists = previous.some((nft) => nft.id === selectedNFT.id);
			if (exists) {
				return previous.filter((nft) => nft.id !== selectedNFT.id);
			} else {
				return [...previous, selectedNFT];
			}
		});
	}

	switch (true) {
		case isLoading:
			return <ContentWrapper>Loading...</ContentWrapper>;

		case isError:
			return (
				<ContentWrapper>
					An error occurred: {error?.message}
				</ContentWrapper>
			);

		case data !== null || undefined:
			const { pools, NFTs } = data;

			switch (activeTab) {
				case "buy":
					content = (
						<>
							<h2>select nfts</h2>
		
							<div>
								<span>pools</span>
								<i>{pools.length}</i>
							</div>
						</>
					);
					break;
		
				case "sell":
					content = (
						<>
							<h2>my nfts</h2>
						</>
					);
					break;
		
				case "liquidity":
					content = (
						<>
							<h2>select nfts to deposit</h2>
						</>
					);
					break;
			}

			return (
				<section className={`${group}`}>
					<div className={`${group}__wrapper`}>
						<div className={`${group}__top`}>{content}</div>
		
						<section className={`${group}__bottom`}>
							<div>
							{[...NFTs].map((nft, index) => {
								const buyPrice = buyPrices.find(price => price.poolAddress === nft.poolAddress);

								return (
									<NFT
										key={index}
										id={index}
										isSelected={selectedNFTs.some(selected => selected.id === nft.id)}
										onSelect={() => handleSelect({ address: nftAddress, id: nft.id, poolAddress: nft.poolAddress })}
										imageUrl={nft.src}
										nftId={nft.id}
										name={nft.name}
										price={
											selectedNFTs.length === 0
												? nft.price
												: (activeTab === "buy" ? buyPrice?.nextPrice : nextSellPrice) || nft.price
										}
										chainId={_chainId}
									/>
								);
							})}

							</div>
		
							{activeTab === "liquidity" && (
								<div className={`${group}__liquidity`}>
									<span>{selectedNFTs.length}</span>
									<span>nft{selectedNFTs.length > 1 ? "s" : ""} selected</span>
								</div>
							)}
						</section>
					</div>
				</section>
			);
	}

	function ContentWrapper({ children }: { children: ReactNode }) {
		return <section className={`${group}__right`}>{children}</section>;
	}
}