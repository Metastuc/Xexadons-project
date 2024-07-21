"use client";
import "./index.scss";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserPools } from "@/api";
import { Polygon, PoolTorch } from "@/assets";
import { NextOptimizedImage } from "@/components/reusable";
import { ContextWrapper } from "@/hooks";
import { truncateWalletAddress } from "@/utils";
import { contentWrapper } from "@/views";

export function UserPools({ chainid, address }: { chainid: number; address: string }) {
	const {
		data: userPools = [],
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["getUserPools", chainid, address],
		queryFn: async () => {
			const response = await getUserPools(chainid, address);
			return response;
		},
	});

	console.log(userPools);

	let children;

	switch (true) {
		case userPools.length > 0:
			children = (
				<div className="grid grid-cols-2 gap-10 place-items-center p-[2.25rem]">
					{userPools.map((pool: any, index: number) => (
						<PoolCard
							key={index}
							{...pool}
						/>
					))}
				</div>
			);
			break;

		case isLoading:
			children = (
				<p className="flex items-center justify-center size-full">Loading...</p>
			);
			break;

		case isError:
			children = (
				<p className="flex items-center justify-center size-full">
					Error: {error?.message}
				</p>
			);
			break;

		case !userPools.length:
			children = (
				<p className="flex items-center justify-center size-full">
					No pools for this user: {truncateWalletAddress(address)}
				</p>
			);
			break;
	}

	return (
		<div className="overflow-y-auto pools__wrapper size-full">
			<h2 className="absolute left-0 -top-[4.5rem]">My Pools</h2>

			{children}
		</div>
	);
}

function PoolCard({
	// poolAddress,
	owner,
	buyPrice,
	sellPrice,
	tokenAmount,
	nftAmount,
	feesEarned,
}: any) {
	const router = useRouter();
	const {
		navContext: { setActiveTab, activeTab },
	} = ContextWrapper();
	const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);

	function toLiquidity() {
		setActiveTab("liquidity");
		setShouldNavigate(true);
	}

	useEffect(() => {
		if (activeTab === "liquidity" && shouldNavigate) {
			router.push("/nfts");
			setShouldNavigate(false);
		}
	}, [activeTab, router, shouldNavigate]);

	return (
		<div className="w-[28.5rem] h-[34.5rem] border border-[#797979] rounded-3xl">
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
					<span className="h-6 bg-[rgb(255,255,255,0.35)] rounded-3xl px-4">
						Pool info
					</span>
					<span className="h-6 bg-[rgb(255,255,255,0.35)] rounded-3xl px-2">
						<PoolTorch />
					</span>
				</div>

				<div className="space-y-4 pools__item__wrapper">
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

					<div className="w-4/5 mx-auto">
						<PoolItem
							label="Fees Earned"
							hasIcon={true}
							value={Number(feesEarned)}
						/>
					</div>

					<div className="flex items-center justify-between mx-auto w-[12.5rem]">
						<p className="text-center">
							~ Each time a swap is made on this pool the creator earns 1.5%
							as trading fees
						</p>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						onClick={toLiquidity}
						className="rounded-[2rem] bg-[#15BFFD] py-2 px-5"
					>
						<span>Add / Remove Liquidity</span>
					</button>
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
								<i className="size-5">
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
