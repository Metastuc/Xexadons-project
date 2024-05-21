import "./index.scss";

import { JSX } from "react";

import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";

// export function PurchaseNFTRight({ group }: commonProps) {
// 	const {
// 		nftContext: { nftAddress, setCollection, setCollectionName },
// 	} = ContextWrapper();

// 	const { chainId, status } = useAccount();

// 	const _chainId = status === "connected" ? chainId : 80002;

// 	const { data, isLoading, isError, error } = useQuery({
// 		queryKey: ["nftCollections", _chainId, nftAddress],
// 		queryFn: async () => getNFTCollections(_chainId, nftAddress),
// 	});

// 	useEffect(() => {
// 		data && (setCollection(data), setCollectionName(data.NFTs[0].name));
// 	}, [data, setCollection, setCollectionName]);

// 	switch (true) {
// 		case isLoading:
// 			return <ContentWrapper>Loading...</ContentWrapper>;

// 		case isError:
// 			return (
// 				<ContentWrapper>
// 					An error occurred: {error?.message}
// 				</ContentWrapper>
// 			);

// 		case data !== null || undefined:
// 			const { pools, NFTs } = data;

// 			return (
// 				<ContentWrapper>
// 					<div>
// 						<h2>Select NFTs</h2>
// 						<div>
// 							<span>Pools</span>
// 							<span>{pools.length}</span>
// 						</div>
// 					</div>
// 					<section>
// 						{NFTs.map(() => {
// 							return <NFT />;
// 						})}
// 					</section>
// 				</ContentWrapper>
// 			);
// 	}

// 	function ContentWrapper({ children }: { children: ReactNode }) {
// 		return <section className={`${group}__right`}>{children}</section>;
// 	}
// }

type PurchaseNFTRightProps = commonProps & {
	activeTab: string;
};

export function PurchaseNFTRight({ group, activeTab }: PurchaseNFTRightProps) {
	let content: JSX.Element | null = null;

	switch (activeTab) {
		case "buy":
			content = (
				<>
					<h2>select nfts</h2>

					<div>
						<span>pools</span>
						<i>2</i>
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

	const {
		nftContext: { selectedNFTs, setSelectedNFTs },
	} = ContextWrapper();

	function handleSelect(index: number) {
		setSelectedNFTs(function (previous) {
			return previous.includes(index)
				? previous.filter((i) => i !== index)
				: [...previous, index];
		});
	}

	return (
		<section className={`${group}`}>
			<div className={`${group}__wrapper`}>
				<div className={`${group}__top`}>{content}</div>

				<section className={`${group}__bottom`}>
					<div>
						{/* eslint-disable-next-line no-unused-vars */}
						{[...Array(7)].map((value, index) => (
							<NFT
								key={index}
								id={index}
								isSelected={selectedNFTs.includes(index)}
								onSelect={handleSelect}
							/>
						))}
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
