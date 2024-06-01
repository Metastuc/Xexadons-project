import "./index.scss";
import { JSX, ReactNode, useEffect } from "react";
import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";
import { getUserNFTs } from "@/api";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export const CreateRight: React.FC<commonProps> = ({ group }) => {
  let content: JSX.Element | null = null;

  const { address, chainId, status } = useAccount();
  const _chainId = status === "connected" ? chainId : 80002;

  const {
    nftContext: { selectedNFTs },
  } = ContextWrapper();

  const {
    nftContext: { nftAddress },
  } = ContextWrapper();

  const {
    nftContext: { setSelectedNFTs },
  } = ContextWrapper();

  const queryFn = async () => getUserNFTs(_chainId, nftAddress, address?? '0x00000');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["nftCollections", _chainId, nftAddress],
    queryFn: queryFn,
  });

  function handleSelect(selectedNFT: { address: string; id: number; poolAddress: string }) {
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
      return <ContentWrapper>An error occurred: {error?.message}</ContentWrapper>;

    case data !== null || undefined:
      const { NFTs } = data;

      content = <h2>Select Nfts</h2>;

      return (
        <section className={`${group}`}>
          <div className={`${group}__wrapper`}>
            <div className={`${group}__top`}>{content}</div>

            <section className={`${group}__bottom`}>
              <div>
                {[...NFTs].map((nft, index) => {
                  return (
                    <NFT
                      key={index}
                      id={index}
                      isSelected={selectedNFTs.some((selected) => selected.id === nft.id)}
                      onSelect={() => handleSelect({ address: nftAddress, id: nft.id, poolAddress: nft.poolAddress })}
                      imageUrl={nft.src}
                      nftId={nft.id}
                      name={nft.name}
                      chainId={_chainId}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </section>
      );
  }

  function ContentWrapper({ children }: { children: ReactNode }) {
    return <section className={`${group}__right`}>{children}</section>;
  }
};
