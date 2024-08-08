"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { getNFTCollections, getPoolActivity } from "@/api";
import { ActivityStar, EtherExplorer, PoolTorch } from "@/assets";
import { NextOptimizedImage } from "@/components";
import { ContextWrapper } from "@/hooks";
import { truncateWalletAddress } from "@/utils";

export default function Page({ params }: { params: { poolID: string } }) {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["poolActivity", params.poolID],
		queryFn: async () => {
			const response = await getPoolActivity(params.poolID);
			return response;
		},
	});

	let children;

	switch (true) {
		case isLoading:
			children = "Loading...";
			break;
		case isError:
			children = error?.message;
			break;
		default:
			children = <RenderContent data={data} />;
	}

	return <>{children}</>;
}

function RenderContent({ data }: { data: any }) {
	return (
		<section className="flex flex-col gap-12 h-[50rem] justify-start">
			<RenderNavigation />
			<section className="border border-[#797979] bg-[#1B111E] rounded-[1.875rem] h-[100%]">
				<div className="flex items-center justify-start gap-14 py-[3.25rem] px-[4.5rem]">
					<span
						className="flex items-center justify-center w-[11.5rem] h-11 bg-[#69626b] rounded-[1.5rem] gap-2.5"
						style={{
							fontFamily: "Lufga",
							fontSize: "1.125rem",
						}}
					>
						<i>
							<ActivityStar />
						</i>
						Pool info
					</span>
					<span
						className="flex items-center justify-center w-[11.5rem] h-11 bg-[#69626b] rounded-[1.5rem] gap-2.5"
						style={{
							fontFamily: "Lufga",
							fontSize: "1.125rem",
						}}
					>
						<i>
							<PoolTorch />
						</i>
						Activity
					</span>
				</div>

				<div className="w-[82rem]">
					<section className="">
						<div className="px-[4.5rem] grid grid-cols-6">
							<div className="flex items-center justify-start capitalize text-[rgba(255,255,255,0.7)] text-xl">
								<span
									style={{
										fontFamily: "Lufga",
									}}
								>
									event
								</span>
							</div>
							<div className="flex items-center justify-start capitalize text-[rgba(255,255,255,0.7)] text-xl">
								<span
									style={{
										fontFamily: "Lufga",
									}}
								>
									item
								</span>
							</div>
							<div className="flex items-center justify-start capitalize text-[rgba(255,255,255,0.7)] text-xl">
								<span
									style={{
										fontFamily: "Lufga",
									}}
								>
									price
								</span>
							</div>
							<div className="flex items-center justify-start capitalize text-[rgba(255,255,255,0.7)] text-xl">
								<span
									style={{
										fontFamily: "Lufga",
									}}
								>
									from
								</span>
							</div>
							<div className="flex items-center justify-start capitalize text-[rgba(255,255,255,0.7)] text-xl">
								<span
									style={{
										fontFamily: "Lufga",
									}}
								>
									to
								</span>
							</div>
							<div className=""></div>
						</div>

						<div className="">
							{data?.map((item: any, index: number) => {
								const eventTextColor =
									item.event === "buy"
										? "text-[#169CD0]"
										: "text-[#EFA1F0]";

								return (
									<div
										key={index}
										className="border-b border-b-[#bab9c1] px-[4.5rem] grid grid-cols-6 py-6"
									>
										<div className="flex flex-col gap-2 overflow-hidden">
											<span
												className={`capitalize ${eventTextColor}`}
												style={{
													fontFamily: "Lufga",
													fontSize: "1.25rem",
													fontWeight: "400",
												}}
											>
												{item.event}
											</span>
											<span
												className="text-[rgba(255,255,255,0.6)]"
												style={{
													fontFamily: "Lufga",
													fontSize: "1.125rem",
													fontWeight: "400",
												}}
											>
												{item.time}
											</span>
										</div>

										<div className="flex gap-2 overflow-hidden">
											<div className="overflow-hidden rounded-3xl size-16">
												<NextOptimizedImage
													src={item.item}
													alt={item.name}
													group="size-full"
												/>
											</div>
											<div className="flex flex-col gap-1">
												<span
													style={{
														fontFamily: "Lufga",
														fontSize: "1.25rem",
														fontWeight: "400",
													}}
												>
													{item.name}
												</span>
												<span
													className="text-[rgba(255,255,255,0.6)]"
													style={{
														fontFamily: "Lufga",
														fontSize: "1.125rem",
														fontWeight: "400",
													}}
												>
													#{item.Id}
												</span>
											</div>
										</div>

										<div className="overflow-hidden">
											<span
												className="text-[rgba(255,255,255,0.9)]"
												style={{
													fontFamily: "Lufga",
													fontSize: "1.25rem",
													fontWeight: "400",
												}}
											>
												{item.price}
											</span>
										</div>

										<div className="overflow-hidden">
											<span
												className="text-[rgba(255,255,255,0.9)]"
												style={{
													fontFamily: "Lufga",
													fontSize: "1.25rem",
													fontWeight: "400",
												}}
											>
												{truncateWalletAddress(item.from, 6)}
											</span>
										</div>

										<div className="overflow-hidden">
											<span
												className="text-[rgba(255,255,255,0.9)]"
												style={{
													fontFamily: "Lufga",
													fontSize: "1.25rem",
													fontWeight: "400",
												}}
											>
												{truncateWalletAddress(item.to, 6)}
											</span>
										</div>
										<div className="overflow-hidden">
											<Link
												href={item.link}
												target="_blank"
											>
												<i className="size-5">
													<EtherExplorer />
												</i>
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					</section>
				</div>
			</section>
		</section>
	);
}

function RenderNavigation() {
	const router = useRouter();
	const { chainId } = useAccount();
	const chain: number = chainId === undefined ? 80002 : chainId;

	const {
		navContext: { setActiveTab, activeTab },
		nftContext: { nftAddress },
	} = ContextWrapper();

	const { data: allPools } = useQuery({
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

	return (
		<div className="sticky top-[11.75rem] flex items-center justify-end space-x-6 size-full w-[82rem] h-14">
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
				onClick={() => router.push("/pools")}
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
	);
}
