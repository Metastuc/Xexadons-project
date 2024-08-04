"use client";
import "./index.scss";

import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

import { UserNfts, UserPools } from "@/components";

export function Pools() {
	const pathname = usePathname();
	const { address, isConnecting, chainId } = useAccount();

	let children;
	switch (pathname) {
		case `/${address}/pools`:
			children = (
				<UserPools
					chainid={chainId!}
					address={address!}
				/>
			);
			break;

		case `/${address}/nfts`:
			children = (
				<UserNfts
					chainid={chainId!}
					address={address!}
				/>
			);
			break;

		default:
			children = (
				<Loading
					address={address}
					isConnecting={isConnecting}
				/>
			);
			break;
	}
	return (
		<section className="relative flex items-center justify-center size-full">
			{children}
		</section>
	);
}

function Loading({
	address,
	isConnecting,
}: {
	address: string | undefined;
	isConnecting: boolean;
}) {
	let children;
	switch (true) {
		case isConnecting:
			children = "Loading...";
			break;

		case address === undefined:
			children = "Please connect your wallet";
			break;
	}

	return <>{children}</>;
}
