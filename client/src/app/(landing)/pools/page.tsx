"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getNFTCollections } from "@/api";
import { Polygon, PoolTorch } from "@/assets";
import { NextOptimizedImage } from "@/components";
import { ContextWrapper } from "@/hooks";
import { truncateWalletAddress } from "@/utils";
import { contentWrapper } from "@/views";

export default function Page() {
	const {
		nftContext: { nftAddress },
		navContext: { setActiveTab, activeTab },
	} = ContextWrapper();
	const router = useRouter();
	const { chainId } = useAccount();
	const chain: number = chainId === undefined ? 80002 : chainId;

	const {
		data: allPools,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["allPools", nftAddress, chain],
		queryFn: async () => {
			const response = await getNFTCollections(chain, nftAddress);
			return response;
		},
	});

	const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);

	function toNfts(tab: string): void {
		setActiveTab(tab);
		setShouldNavigate(true);
	}

	useEffect(() => {
		if ((activeTab === "buy" || activeTab === "sell") && shouldNavigate) {
			router.push("/nfts");
			setShouldNavigate(false);
		}
	}, [activeTab, router, shouldNavigate]);

	let children;

	switch (true) {
		case allPools?.pools?.length > 0:
			children = (
				<div className="grid grid-cols-2 gap-10 place-items-center p-[2.25rem]">
					{allPools?.pools.map((pool: any, index: number) => (
						<PoolCard
							key={index}
							{...pool}
						/>
					))}
				</div>
			);
			break;

		case isLoading:
			children = <p className="mt-40 text-center size-full">Loading...</p>;
			break;
		case isError:
			children = (
				<p className="mt-40 text-center size-full">Error: {error.message}</p>
			);
			break;
		default:
			children = <p>No data</p>;
	}

	return (
		<section className="flex flex-col">
			<div className="sticky top-[11.75rem] flex items-center justify-end space-x-6 size-full w-[64rem]">
				<span
					className="text-center w-[6.5rem] h-[1.875rem] flex items-center justify-center rounded-xl cursor-pointer bg-[#6d697d]"
					onClick={() => {
						toNfts("buy");
					}}
					style={{
						fontFamily: "Clash Display",
						fontSize: "1.125rem",
						color: "rgb(255, 255, 255, 0.80)",
						textTransform: "capitalize",
					}}
				>
					buy
				</span>
				<span
					className="text-center w-[6.5rem] h-[1.875rem] flex items-center justify-center rounded-xl cursor-pointer bg-[#6d697d]"
					onClick={() => {
						toNfts("sell");
					}}
					style={{
						fontFamily: "Clash Display",
						fontSize: "1.125rem",
						color: "rgb(255, 255, 255, 0.80)",
						textTransform: "capitalize",
					}}
				>
					sell
				</span>
				<span
					className="text-center w-[6.5rem] h-[1.875rem] flex items-center justify-center rounded-xl cursor-pointer bg-[#6d697d]"
					style={{
						fontFamily: "Clash Display",
						fontSize: "1.125rem",
						color: "rgb(255, 255, 255, 0.80)",
						textTransform: "capitalize",
					}}
				>
					pools
					<i
						className="flex items-center justify-center not-italic rounded-full size-5 bg-[#fff] ml-2"
						style={{
							fontFamily: "Clash Display",
							fontSize: ".875rem",
							color: "#21192F",
						}}
					>
						{allPools?.pools?.length || 0}
					</i>
				</span>
			</div>
			{children}
		</section>
	);
}

function PoolCard({
	poolAddress,
	owner,
	buyPrice,
	sellPrice,
	tokenAmount,
	nftAmount,
}: any) {
	const router = useRouter();

	return (
		<div className="w-[28.5rem] h-[34.5rem] border border-[#797979] rounded-3xl bg-[#1a111f]">
			<div className="flex items-center justify-between p-5 border-b border-b-[rgb(255,255,255,0.25)] pools__header">
				<div className="flex items-center gap-2">
					<NextOptimizedImage
						src="/pf-icon.png"
						alt="profile-icon"
						group="size-5 mix-blend-luminosity"
					/>
					<span>{truncateWalletAddress(owner)}</span>
				</div>
				<button className="rounded-2xl bg-[#15BFFD] w-[4.5rem] h-6 flex items-center justify-center">
					<span>Trade</span>
				</button>
			</div>

			<div className="px-8 py-6 space-y-6">
				<div className="flex items-center justify-start gap-2 pools__actions">
					<span className="h-6 bg-[rgb(255,255,255,0.35)] rounded-3xl px-4 cursor-pointer">
						Pool info
					</span>
					<span
						className="h-6 bg-[rgb(255,255,255,0.35)] rounded-3xl px-2 cursor-pointer"
						onClick={() => {
							router.push(`/pools/${poolAddress}`);
						}}
					>
						<PoolTorch />
					</span>
				</div>

				<div className="space-y-16 pools__item__wrapper">
					{contentWrapper({
						children: (
							<div className="space-y-3">
								<PoolItem
									label="Sell Price"
									hasIcon={true}
									value={Number(sellPrice).toFixed(3)}
								/>
								<PoolItem
									label="Buy Price"
									hasIcon={true}
									value={Number(buyPrice).toFixed(3)}
								/>
								<p>Pool Balance</p>
								<PoolItem
									label="Nfts"
									hasIcon={false}
									value={nftAmount}
								/>
								<PoolItem
									label="Token"
									hasIcon={true}
									value={Number(tokenAmount)}
								/>
							</div>
						),
					})}

					<div className="flex items-center justify-between mx-auto w-[12.5rem]">
						<p
							className="text-center"
							style={{
								fontFamily: "Clash Display",
								fontSize: ".625rem",
								color: "rgb(255, 255, 255, 0.60)",
							}}
						>
							~ Each time a swap is made on this pool the creator earns 1.5%
							as trading fees
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function PoolItem({
	label,
	hasIcon,
	value,
}: {
	label: string;
	hasIcon: boolean;
	value: any;
}) {
	return (
		<div className="flex items-center justify-between pools__item">
			<span>{label}</span>
			<span className="w-[6.25rem] h-[1.75rem] pools__item__right">
				{contentWrapper({
					children: (
						<div className="flex items-center justify-center gap-1 px-1">
							<span className="text-center">{value}</span>
							{hasIcon && (
								<i className="pt-0.5 size-5">
									<Polygon />
								</i>
							)}
						</div>
					),
				})}
			</span>
		</div>
	);
}
