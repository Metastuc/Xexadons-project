import "./index.scss";
import { JSX, ReactNode, useEffect } from "react";
import { NFT } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { commonProps } from "@/types";
import { getPoolNFTs } from "@/api";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { getCoinPrice, getCurrency, getWithdrawAmount } from "@/utils/app";

export const WithdrawRight: React.FC<commonProps> = ({ group }) => {
  let content: JSX.Element | null = null;

  const { address, chainId, status } = useAccount();
  const _chainId = status === "connected" ? chainId : 80002;

  const {
    nftContext: { selectedNFTs, setDollarAmount, setFeesEarned, setWithdrawAmount },
  } = ContextWrapper();

  const {
    nftContext: { nftAddress, poolAddress },
  } = ContextWrapper();

  const {
    nftContext: { setSelectedNFTs },
  } = ContextWrapper();

  const queryFn = async () => getPoolNFTs(_chainId, nftAddress, poolAddress);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["nftCollections", _chainId, nftAddress],
    queryFn: queryFn,
  });

  useEffect(() => {
	if (data) {
		const { feesEarned } = data;
		const _fees = formatEther(BigInt(feesEarned))
		const _feesEarned = Math.floor((Number(_fees)) * 10000) / 10000;
		console.log("42", _feesEarned);
		const currency = getCurrency(_chainId);
		const fees = _feesEarned.toString() + currency;
		console.log("45", fees);
		
		setFeesEarned(fees);
	}
  }, [data]);

  useEffect(() => {
	const calculateWithdrawAmount = async () => {
		let withdrawAmount = 0;
		if (selectedNFTs.length > 0) {
			const amount = await getWithdrawAmount(selectedNFTs.length, poolAddress, _chainId)
			withdrawAmount = amount!== undefined? amount : 0;
		}
		const _withdrawAmount = formatEther(BigInt(withdrawAmount));
		const _coinPrice = await getCoinPrice(_chainId);
		const coinPrice = Number(_coinPrice);
		const _dollarAmount = coinPrice * Number(_withdrawAmount);
		const amountIn = Math.ceil(Number(_withdrawAmount) * 100) / 100;
		setWithdrawAmount(amountIn);
		const dollarAmount = Math.ceil(_dollarAmount * 100) / 100;
		setDollarAmount(dollarAmount);
	};

	calculateWithdrawAmount();
}, [selectedNFTs]);

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

      content = <h2>Select Nfts to withdraw</h2>;

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
