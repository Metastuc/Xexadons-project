import "./index.scss";

import { useQuery } from "@tanstack/react-query";
import { JSX, ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";

import { getNFTCollections, getUserCollectionsNFTs } from "@/api";
import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps, NFTprops } from "@/types";

type PurchaseNFTRightProps = commonProps & {
	activeTab: string;
};

export function PurchaseNFTRight({ group, activeTab }: PurchaseNFTRightProps) {
	const {
		nftContext: {
			selectedNFTs,
			nftAddress,
			poolAddress,
			buyPrices,
			nextSellPrice,
			setSelectedNFTs,
			setCollection,
			setCollectionName,
			setPools,
		},
	} = ContextWrapper();

	const { chainId, address } = useAccount();
	const chain: number = chainId === undefined ? 80002 : chainId;

	function getQueryFunction(
		activeTab: string,
		chain: number,
		nftAddress: string,
		poolAddress: string,
		address?: `0x${string}`,
	): () => Promise<any> {
		if (activeTab === "buy") {
			return async () => getNFTCollections(chain, nftAddress);
		} else {
			return async () =>
				getUserCollectionsNFTs(
					chain,
					nftAddress,
					address ?? "0x00000",
					poolAddress,
					activeTab,
				);
		}
	}

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["nftCollections", chain, nftAddress, activeTab],
		queryFn: getQueryFunction(
			activeTab,
			chain,
			nftAddress,
			poolAddress,
			address ?? "0x00000",
		),
	});

	useEffect(() => {
		if (activeTab === "buy" && data) {
			setCollection(data);
			setCollectionName(data.NFTs[0]?.name);
			setPools(data.pools);
		}
	}, [activeTab, data, setCollection, setCollectionName, setPools]);

	function handleSelect(selectedNFT: NFTprops) {
		setSelectedNFTs((previous) => {
			const exists = previous.some((nft) => nft.id === selectedNFT.id);
			if (exists) {
				return previous.filter((nft) => nft.id !== selectedNFT.id);
			} else {
				return [...previous, selectedNFT];
			}
		});
	}

	let content: JSX.Element | null = null;

	switch (true) {
		case isLoading:
			return <ContentWrapper>Loading...</ContentWrapper>;

		case isError:
			return <ContentWrapper>An error occurred: {error?.message}</ContentWrapper>;

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
									const buyPrice = buyPrices.find(
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
													: (activeTab === "buy"
														? buyPrice?.nextPrice
														: activeTab === "sell"
															? nextSellPrice
															: nft.price) || nft.price
											}
											chainId={chain}
										/>
									);
								})}
							</div>

							{activeTab === "liquidity" && (
								<div className={`${group}__liquidity`}>
									<span>{selectedNFTs.length}</span>
									<span>
										nft{selectedNFTs.length > 1 ? "s" : ""} selected
									</span>
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
