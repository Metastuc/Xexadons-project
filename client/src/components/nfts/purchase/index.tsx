"use client"
import "./index.scss";

import { ArrowDeg90, Polygon, Xexadons } from "@/assets";
import { commonProps } from "@/types";
import { contentWrapper } from "@/views";
import { ContextWrapper } from "@/hooks";
import { useState, useEffect } from "react";
import { getCoinPrice, buyNFT, getSellPrice, sellNFT } from "@/utils/app";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useEthersSigner } from "@/utils/adapter";

type purchaseNftProps = commonProps & {
	activeTab: string;
};

export function PurchaseNft({ group, activeTab }: purchaseNftProps) {
	return (
		<section className={group}>
			<>{renderTitle({ group, activeTab })}</>
			<>{renderContent({ group, activeTab })}</>
		</section>
	);
}

function renderTitle({ group, activeTab }: purchaseNftProps) {
	let text: string | null = "";

	switch (activeTab) {
		case "buy":
			text = `~ select nft you wish to buy from the collection and proceed to swap`;
			break;

		case "sell":
			text = `~ select nft you wish to sell from your wallet, proceed to swap to token`;
			break;
	}

	return (
		<section className={`${group}__title`}>
			<h2>swap</h2>

			<p>{text}</p>
		</section>
	);
}

function renderContent({ group, activeTab }: purchaseNftProps) {
	return (
		<section className={`${group}__content`}>
			<>
				{contentWrapper({
					children: renderTopContent({ group, activeTab }),
				})}
			</>

			<>
				{contentWrapper({
					children: renderBottomContent({ group, activeTab }),
				})}
			</>
		</section>
	);
}

function renderTopContent({ group, activeTab }: purchaseNftProps) {
	const [buyAmount, setBuyAmount] = useState(0);
	const [dollarAmount, setDollarAmount] = useState(0);
	const [sellAmount, setSellAmount] = useState(0);

	const { chainId, status } = useAccount();
	const _chainId = status === "connected" ? chainId : 80002;

	const {
		nftContext: { selectedNFTs },
	} = ContextWrapper();
	console.log(selectedNFTs);

	const {
		nftContext: { pools },
	} = ContextWrapper();

	useEffect(() => {
        const calculateBuyAmount = async () => {
            // Calculate total amountIn for all pools
            const newTotalAmountIn = pools.reduce((sum, pool) => {
                const C = selectedNFTs.filter(nft => nft.poolAddress === pool.poolAddress);
                return sum + ((pool.reserve1 * C.length) / (pool.reserve0 - C.length));
            }, 0);
            // const poolPrices = pools.reduce((acc, pool) => {
            //     const C = selectedNFTs.filter(nft => nft.poolAddress === pool.poolAddress);
            //     const next_price = (pool.reserve1 * C.length) / (pool.reserve0 - C.length);
            //     acc[pool.poolAddress] = next_price;
            //     return acc;
            // }, {});
            // console.log(poolPrices);
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
    
        calculateBuyAmount();
    }, [pools, selectedNFTs]);
	
    useEffect(() => {
        const calculateSellAmount = async () => {
            let sellAmount = 0;
            if (selectedNFTs.length > 0) {
                const price = await getSellPrice(selectedNFTs.length, selectedNFTs[0].address, chainId)
                sellAmount = price!== undefined? price : 0;
            }
            const _sellAmount = formatEther(BigInt(sellAmount));
			const _coinPrice = await getCoinPrice(_chainId);
			const coinPrice = Number(_coinPrice);
            const _dollarAmount = coinPrice * Number(_sellAmount);
			const amountOut = Math.floor(Number(_sellAmount) * 100) / 100;
            setSellAmount(amountOut);
			const dollarAmount = Math.floor(_dollarAmount * 100) / 100;
            setDollarAmount(dollarAmount);
        };
    
        calculateSellAmount();
    }, [selectedNFTs]);

	return (
		<div className={`${group}__content-top`}>
			<article className={`${group}__from-to`}>
				<span>from</span>
				<span>to</span>
			</article>

			{group.includes("buy") ? (
				<>
					<article className={`${group}__price`}>
						<div>
							<span>{buyAmount}</span>
							<span>${dollarAmount}</span>
						</div>

						<i>{ArrowDeg90()}</i>

						<span>{selectedNFTs.length} xexadons</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__price ${activeTab}`}>
						<span>{selectedNFTs.length} xexadons</span>

						<i>{ArrowDeg90()}</i>

						<div>
							<span>{sellAmount}</span>
							<span>${dollarAmount}</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<article className={`${group}__currency`}>
						<span>
							<i>{Polygon()}</i>
							<span>polygon</span>
						</span>

						<span>
							<i>{Xexadons()}</i>
							<span>xexadons</span>
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__currency`}>
						<span>
							<i>{Xexadons()}</i>
							<span>xexadons</span>
						</span>

						<span>
							<i>{Polygon()}</i>
							<span>polygon</span>
						</span>
					</article>
				</>
			)}
		</div>
	);
}

function renderBottomContent({ group, activeTab }: purchaseNftProps) {
	const [buyAmount, setBuyAmount] = useState(0);
	const [sellAmount, setSellAmount] = useState(0);

	const { address, chainId, status } = useAccount();
	const add = address?.slice(0, 6) + "..." + address?.slice(-3) || 'account';
	const _chainId = status === "connected" ? chainId : 80002;

	const {
		nftContext: { selectedNFTs },
	} = ContextWrapper();
	console.log(selectedNFTs);

	const {
		nftContext: { pools },
	} = ContextWrapper();

	useEffect(() => {
        const calculateBuyAmount = async () => {
            // Calculate total amountIn for all pools
            const newTotalAmountIn = pools.reduce((sum, pool) => {
                const C = selectedNFTs.filter(nft => nft.poolAddress === pool.poolAddress);
                return sum + ((pool.reserve1 * C.length) / (pool.reserve0 - C.length));
            }, 0);
			const newTotalAmountIn_ = BigInt(newTotalAmountIn);
			const _newTotalAmountIn = formatEther(newTotalAmountIn_);
			const amountIn = Math.ceil(Number(_newTotalAmountIn) * 100) / 100;
            setBuyAmount(amountIn);
        };
    
        calculateBuyAmount();
    }, [pools, selectedNFTs]);
	
	useEffect(() => {
        const calculateSellAmount = async () => {
            let sellAmount = 0;
            if (selectedNFTs.length > 0) {
                const price = await getSellPrice(selectedNFTs.length, selectedNFTs[0].address, chainId)
                sellAmount = price!== undefined? price : 0;
            }
            const _sellAmount = formatEther(BigInt(sellAmount));
			const amountOut = Math.floor(Number(_sellAmount) * 100) / 100;
            setSellAmount(amountOut);
        };
    
        calculateSellAmount();
    }, [selectedNFTs]);


	const signer = useEthersSigner();

	const buyNFTs = async() => {
        await buyNFT(selectedNFTs, chainId, signer);
        console.log("successfully");
    }

	const sellNFTs = async() => {
        await sellNFT(selectedNFTs, selectedNFTs[0].address, chainId, signer);
        console.log("successfully");
    }

	function handleProceed() {
        if (activeTab === "buy") {
            buyNFTs();
        } else if (activeTab === "sell") {
            sellNFTs();
        }
    }

	return (
		<div className={`${group}__content-bottom`}>
			{group.includes("buy") ? (
				<>
					<article className={`${group}__detail`}>
						<div className={`${group}__detail-1`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-2`}>
							<span>router</span>
							<span>receiver</span>
						</div>

						<div className={`${group}__detail-3`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-4`}>
							<span>0xe9c...26Ca</span>
							<span>{add}</span>
						</div>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__detail`}>
						<div className={`${group}__detail-1`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-2`}>
							<span>from</span>
							<span>nft pool</span>
						</div>

						<div className={`${group}__detail-3 ${activeTab}`}>
							<span></span>
							<i></i>
							<span></span>
						</div>

						<div className={`${group}__detail-4`}>
						<span>0xe9c...26Ca</span>
							<span>{add}</span>
						</div>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>{Polygon()}</i>
							<span>{buyAmount} matic</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>{Xexadons()}</i>
							<span>{selectedNFTs.length} xexadons</span>
						</span>
					</article>
				</>
			) : (
				<>
					<article className={`${group}__swap`}>
						<span>
							<i>{Xexadons()}</i>
							<span>{selectedNFTs.length} xexadons</span>
						</span>

						<i>{ArrowDeg90()}</i>

						<span>
							<i>{Polygon()}</i>
							<span>{sellAmount} matic</span>
						</span>
					</article>
				</>
			)}

			{group.includes("buy") ? (
				<>
					<p className={`${group}__description`}>
						~swap {buyAmount} matic <i>{Polygon()}</i> for {selectedNFTs.length} xexadons
					</p>
				</>
			) : (
				<>
					<p className={`${group}__description`}>
						~swap {selectedNFTs.length} xexadons for {sellAmount} matic <i></i>
					</p>
				</>
			)}

			<article className={`${group}__confirmation`}>
				<button onClick={handleProceed}>proceed</button>
			</article>
		</div>
	);
}
