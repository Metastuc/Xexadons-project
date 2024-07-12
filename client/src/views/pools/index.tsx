"use client";

import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export function Pools() {
	const pathname = usePathname();
	const { address } = useAccount();

	let children;
	switch (pathname) {
		case `/${address}/pools`:
			children = <UserPools />;
			break;

		case `/${address}/nfts`:
			children = <UserNfts />;
			break;

		default:
			children = <Loading />;
			break;
	}
	return <>{children}</>;
}

function UserNfts() {
	return <>sad</>;
}

function UserPools() {
	return <>happy</>;
}

function Loading() {
	return <>Loading...</>;
}
