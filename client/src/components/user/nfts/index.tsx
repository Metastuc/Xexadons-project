import "./index.scss";

import { useQuery } from "@tanstack/react-query";

import { getUserCollectionsNFTs } from "@/api";
import { NextOptimizedImage } from "@/components/reusable";
import { DEPLOYMENT_ADDRESSES } from "@/lib";
import { truncateWalletAddress } from "@/utils";

export function UserNfts({ chainid, address }: { chainid: number; address: string }) {
	const {
		data: userNfts,
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["getUserNfts", chainid, address],
		queryFn: async () => {
			const response = await getUserCollectionsNFTs(
				"create",
				chainid,
				DEPLOYMENT_ADDRESSES.xexadon[chainid],
				address as `0x${string})`,
			);
			return response;
		},
	});

	let children;

	switch (true) {
		case userNfts?.NFTs!.length > 0:
			children = (
				<div className="grid grid-cols-7 gap-4 place-items-center p-[1rem]">
					{userNfts?.NFTs.map((nft: any, index: number) => (
						<NFTCard
							key={index}
							{...nft}
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

		case !userNfts?.NFTs!.length:
			children = (
				<p className="flex items-center justify-center size-full">
					The user &apos;{truncateWalletAddress(address)}&apos; doesn&apos;t
					have any NFT.
				</p>
			);
			break;
	}

	return (
		<div className="overflow-y-auto pools__wrapper size-full">
			<h2 className="absolute left-0 -top-[4.5rem]">My NFTs (Xexadons)</h2>

			{children}
		</div>
	);
}

function NFTCard({ id, name, src }: any) {
	return (
		<div className="w-[9.5rem] h-[12rem] border border-[#564b63] rounded-2xl flex flex-col align-center py-2 px-1 userNfts__item">
			<span className="w-[8.75rem] h-[7.75rem] flex">
				<NextOptimizedImage
					src={src}
					alt={name}
					group="rounded-2xl size-full"
				/>
			</span>

			<div className="flex flex-col mt-2">
				<span>#{id}</span>
				<span>Xexadons {id}</span>
			</div>
		</div>
	);
}
