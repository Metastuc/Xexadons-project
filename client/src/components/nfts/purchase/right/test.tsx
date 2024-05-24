import "./index.scss";
import { JSX, ReactNode, useEffect } from "react";
import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";
import { getNFTCollections, getUserCollectionNFTs } from "@/api";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

type PurchaseNFTRightProps = commonProps & {
    activeTab: string;
};

export function PurchaseNFTRight({ group, activeTab }: PurchaseNFTRightProps) {
    let content: JSX.Element | null = null;

    const {
        nftContext: { nftAddress, setCollection, setCollectionName },
    } = ContextWrapper(); // Moved up

    const { address, chainId, status } = useAccount(); // Moved up
    const _chainId = status === "connected" ? chainId : 80002; // Moved up

    const queryFn = activeTab === "sell"
    ? async () => getUserCollectionNFTs(_chainId, nftAddress, address?? '0x00000')
        : async () => getNFTCollections(_chainId, nftAddress);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["nftCollections", _chainId, nftAddress, activeTab],
        queryFn: queryFn,
    }); // Moved up

    useEffect(() => {
        if (data) {
            setCollection(data);
            setCollectionName(data.NFTs[0]?.name || "");
        }
    }, [data, setCollection, setCollectionName]); // Moved up

    const {
        nftContext: { selectedNFTs, setSelectedNFTs },
    } = ContextWrapper(); // Moved up

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

    function buyNFTs() {
        // Logic for buying NFTs
        console.log("Buying NFTs");
    }

    function sellNFTs() {
        // Logic for selling NFTs
        console.log("Selling NFTs");
    }

    function handleProceed() {
        if (activeTab === "buy") {
            buyNFTs();
        } else if (activeTab === "sell") {
            sellNFTs();
        }
    }

    if (isLoading) { // Condition moved outside switch
        return <ContentWrapper>Loading...</ContentWrapper>;
    }

    if (isError) { // Condition moved outside switch
        return (
            <ContentWrapper>
                An error occurred: {error?.message}
            </ContentWrapper>
        );
    }

    if (data !== null && data !== undefined) { // Condition moved outside switch
        const { pools, NFTs } = data;

        switch (activeTab) {
            case "buy":
                content = (
                    <>
                        <h2>Select NFTs</h2>
                        <div>
                            <span>Pools</span>
                            <i>{pools.length}</i>
                        </div>
                    </>
                );
                break;

            case "sell":
                content = (
                    <>
                        <h2>My NFTs</h2>
                    </>
                );
                break;

            case "liquidity":
                content = (
                    <>
                        <h2>Select NFTs to Deposit</h2>
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
                            {[...NFTs].map((nft, index) => (
                                <NFT
                                    key={index}
                                    id={index}
                                    isSelected={selectedNFTs.some(selected => selected.id === nft.id)}
                                    onSelect={handleSelect({ address: nftAddress, id: nft.id, poolAddress: nft.poolAddress })}
                                    imageUrl={nft.src}
                                    nftId={nft.id}
                                    name={nft.name}
                                    price={nft.price}
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
                <button onClick={handleProceed}>Proceed</button>
            </section>
        );
    }

    return null;

    function ContentWrapper({ children }: { children: ReactNode }) {
        return <section className={`${group}__right`}>{children}</section>;
    }
}
