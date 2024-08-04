import "./index.scss";

import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { JSX, ReactNode, useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getNFTCollections, getUserCollectionsNFTs } from "@/api";
import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { getCoinPrice, getCurrency, getDepositAmount, getSellPrice } from "@/lib";
import { commonProps, NFTprops } from "@/types";

type PurchaseNFTRightProps = commonProps & {
	activeTab: string;
};

interface PoolPrice {
	poolAddress: string;
	nextPrice: string;
}

export function PurchaseNFTRight({ group, activeTab }: PurchaseNFTRightProps) {
	const {
		nftContext: {
			selectedNFTs,
			nftAddress,
			poolAddress,
			buyPrices,
			pools,
			nextSellPrice,
			collectionNfts,
			userCollectionAddress,
			setSelectedNFTs,
			setCollectionNfts,
			setCollection,
			setCollectionName,
			setPools,
			setBuyPrices,
			setBuyAmount,
			setDollarAmount,
			setSellAmount,
			setNextSellPrice,
			setDepositAmount,
		},
	} = ContextWrapper();

	const { chainId, address } = useAccount();
	const chain: number = chainId === undefined ? 80002 : chainId;
	const [currentUserCollectionAddress, setCurrentUserCollectionAddress] =
		useState<string>(userCollectionAddress);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: [
			"nftCollections",
			chain,
			nftAddress,
			activeTab,
			currentUserCollectionAddress,
		],
		queryFn: getQueryFunction(
			activeTab,
			chain,
			nftAddress,
			poolAddress,
			address ?? "0x00000",
			currentUserCollectionAddress,
		),
	});

	!!data && (setPools(data.pools), setCollectionNfts(data.NFTs));

	function getQueryFunction(
		activeTab: string,
		chain: number,
		nftAddress: string,
		poolAddress: string,
		address?: `0x${string}`,
		currentUserCollectionAddress?: string,
	): () => Promise<any> {
		if (activeTab === "buy") {
			return async () => getNFTCollections(chain, nftAddress);
		} else if (activeTab === "create" && currentUserCollectionAddress !== "") {
			return async () =>
				getUserCollectionsNFTs(
					"create",
					chainId || 0,
					currentUserCollectionAddress as string,
					address as `0x${string}`,
				);
		} else {
			return async () =>
				getUserCollectionsNFTs(
					activeTab,
					chain,
					nftAddress,
					address ?? "0x00000",
					poolAddress,
				);
		}
	}

	function handleSelect(selectedNFT: NFTprops): void {
		setSelectedNFTs((previous) => {
			const exists = previous.some((nft) => nft.id === selectedNFT.id);
			if (exists) {
				return previous.filter((nft) => nft.id !== selectedNFT.id);
			} else {
				return [...previous, selectedNFT];
			}
		});
	}

	function selectAllNFTs() {
		setSelectedNFTs(
			collectionNfts.map((nft) => ({
				address: nftAddress,
				id: nft.id,
				poolAddress: nft.poolAddress,
			})),
		);
	}

	function deselectAllNFTs() {
		setSelectedNFTs([]);
	}

	const calculateBuyAmount: () => Promise<void> = useCallback(async () => {
		const newTotalAmountIn: number =
			pools &&
			pools.reduce((sum, pool) => {
				const C = selectedNFTs.filter(
					(nft) => nft.poolAddress === pool.poolAddress,
				);
				if (C.length === pool.nftAmount) {
					return sum + pool.tokenAmount * C.length;
				} else {
					return (
						sum + (pool.tokenAmount * C.length) / (pool.nftAmount - C.length)
					);
				}
			}, 0);

		const poolPrices: PoolPrice[] =
			pools &&
			pools.reduce((acc: PoolPrice[], pool) => {
				const C = selectedNFTs.filter(
					(nft) => nft.poolAddress === pool.poolAddress,
				);
				let _next_price = 0;
				if (pool.nftAmount > C.length + 1) {
					_next_price =
						Math.ceil(
							((pool.tokenAmount * (C.length + 1)) /
								(pool.nftAmount - (C.length + 1))) *
								100,
						) / 100;
				} else {
					_next_price =
						Math.ceil(pool.tokenAmount * (C.length + 1) * 100) / 100;
				}
				const currency: number = getCurrency(chain);
				console.log(pool, pool.tokenAmount, C.length);
				const next_price: string = _next_price.toString() + currency;

				acc.push({
					poolAddress: pool.poolAddress,
					nextPrice: next_price,
				});

				return acc;
			}, []);
		console.log(newTotalAmountIn);
		const _newTotalAmountIn: string = newTotalAmountIn.toString();
		const coinPrice: number = Number(await getCoinPrice(chain));
		const _dollarAmount: number = coinPrice * Number(_newTotalAmountIn);

		const amountIn: number = Math.ceil(Number(_newTotalAmountIn) * 100) / 100;
		const dollarAmount: number = Math.ceil(_dollarAmount * 100) / 100;

		setBuyAmount(amountIn);
		setBuyPrices(poolPrices);
		setDollarAmount(dollarAmount);
	}, [pools, selectedNFTs, chain, setBuyAmount, setBuyPrices, setDollarAmount]);

	const calculateSellAmount: () => Promise<void> = useCallback(async () => {
		let sellAmount: number = 0;
		let nextAmount: number = 0;

		if (selectedNFTs.length > 0) {
			const price: number | undefined = await getSellPrice(
				selectedNFTs.length,
				selectedNFTs[0].address,
				chain,
			);
			const _price: number | undefined = await getSellPrice(
				selectedNFTs.length + 1,
				selectedNFTs[0].address,
				chain,
			);

			sellAmount = price !== undefined ? price : 0;

			if (
				_price !== undefined &&
				price !== undefined &&
				typeof _price === "number" &&
				typeof price === "number"
			) {
				nextAmount = _price - price;
			} else {
				nextAmount = 0;
			}
		}

		const _sellAmount = formatEther(BigInt(sellAmount));
		const _nextAmount = formatEther(BigInt(nextAmount));
		const coinPrice = Number(await getCoinPrice(chain));
		const _dollarAmount = coinPrice * Number(_sellAmount);

		const currency = getCurrency(chain);
		const dollarAmount = Math.floor(_dollarAmount * 100) / 100;
		const amountOut = Math.floor(Number(_sellAmount) * 100) / 100;
		const nextPrice =
			(Math.floor(Number(_nextAmount) * 100) / 100).toString() + currency;

		setSellAmount(amountOut);
		setNextSellPrice(nextPrice);
		setDollarAmount(dollarAmount);
	}, [chain, selectedNFTs, setDollarAmount, setNextSellPrice, setSellAmount]);

	const calculateDepositAmount: () => Promise<void> = useCallback(async () => {
		let depositAmount = 0;
		if (selectedNFTs.length > 0) {
			const amount = await getDepositAmount(
				selectedNFTs.length,
				poolAddress,
				chain,
			);
			depositAmount = amount !== undefined ? amount : 0;
		}
		const coinPrice = Number(await getCoinPrice(chain));
		const _depositAmount = formatEther(BigInt(depositAmount));
		const _dollarAmount = coinPrice * Number(_depositAmount);

		const amountIn = Math.ceil(Number(_depositAmount) * 100) / 100;
		const dollarAmount = Math.ceil(_dollarAmount * 100) / 100;

		setDepositAmount(amountIn);
		setDollarAmount(dollarAmount);
	}, [chain, poolAddress, selectedNFTs.length, setDepositAmount, setDollarAmount]);

	useEffect(() => {
		if (activeTab === "buy" && data) {
			setCollection(data);
			setCollectionName(data.NFTs[0]?.name);
			setPools(data.pools);
		}
	}, [activeTab, data, setCollection, setCollectionName, setPools]);

	useEffect(() => {
		setCurrentUserCollectionAddress(userCollectionAddress);
	}, [userCollectionAddress]);

	useEffect(() => {
		const calculatePrice = async () => {
			switch (true) {
				case activeTab === "buy":
					await calculateBuyAmount();
					break;
				case activeTab === "sell":
					await calculateSellAmount();
					break;
				case activeTab === "deposit":
					await calculateDepositAmount();
					break;
				default:
					break;
			}
		};

		calculatePrice();
	}, [
		selectedNFTs,
		activeTab,
		calculateBuyAmount,
		calculateSellAmount,
		calculateDepositAmount,
	]);

	let content: JSX.Element | null = null;

	switch (true) {
		case isLoading:
			return <ContentWrapper>Loading...</ContentWrapper>;

		case isError:
			return <ContentWrapper>An error occurred: {error?.message}</ContentWrapper>;

		case data !== null || undefined:
			switch (activeTab) {
				case "buy":
					content = (
						<>
							<h2>select nfts</h2>

							<div>
								<span>pools</span>
								<i>{pools && pools.length}</i>
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

				case "create":
					content =
						userCollectionAddress !== "" ? (
							<>
								<h2>select nfts</h2>

								<div>
									<button
										onClick={selectAllNFTs}
										className="px-5"
									>
										<span>select all</span>
									</button>

									<button
										onClick={deselectAllNFTs}
										className="px-5"
									>
										<span>deselect all</span>
									</button>
								</div>
							</>
						) : null;

				default:
					break;
			}
	}

	function renderNFTs() {
		if (collectionNfts && collectionNfts.length > 0) {
			return (
				<div>
					{[...collectionNfts].map((nft, index) => {
						const buyPrice =
							buyPrices &&
							buyPrices.find(
								(price) => price.poolAddress === nft.poolAddress,
							);

						return (
							<NFT
								key={index}
								id={index}
								isSelected={selectedNFTs.some(
									(selected) => selected.id === nft.id,
								)}
								onSelect={() =>
									handleSelect({
										address: nftAddress,
										id: nft.id,
										poolAddress: nft.poolAddress,
									})
								}
								imageUrl={nft.src}
								nftId={nft.id}
								name={nft.name}
								price={
									selectedNFTs.length === 0
										? nft.price
										: activeTab === "buy"
											? buyPrice?.nextPrice
											: activeTab === "sell"
												? nextSellPrice
												: nft.price || nft.price
								}
								chainId={chain}
							/>
						);
					})}
				</div>
			);
		} else {
			return <p className="text-xl text-center">No NFTs found!</p>;
		}
	}

	function renderLiquiditySection() {
		return (
			<div className={`${group}__liquidity`}>
				<span>{selectedNFTs.length}</span>
				<span>nft{selectedNFTs.length > 1 ? "s" : ""} selected</span>
			</div>
		);
	}

	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__top`}>{content}</div>

				<section className={`${group}__bottom`}>
					{activeTab === "create" ? (
						currentUserCollectionAddress !== "" ? (
							renderNFTs()
						) : (
							<p className="text-xl text-center">
								Select a collection from your wallet to proceed...
							</p>
						)
					) : (
						renderNFTs()
					)}

					{activeTab === "liquidity" && renderLiquiditySection()}
				</section>
			</div>
		</section>
	);

	function ContentWrapper({ children }: { children: ReactNode }) {
		return <section className={`${group}__right`}>{children}</section>;
	}
}
