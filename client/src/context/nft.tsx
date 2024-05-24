"use client";

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

import { DEPLOYMENT_ADDRESSES } from "@/lib";

type NFT = {
	address: string;
	id: number;
	poolAddress: string;
};

type Pool = {
	poolAddress: string;
	reserve0: number;
	reserve1: number;
}

type NFTContextType = {
	nftAddress: string;
	setNftAddress: Dispatch<SetStateAction<string>>;
};

type NFTCollection = {
	collection: any;
	setCollection: Dispatch<SetStateAction<any>>;

	collectionName: string;
	setCollectionName: Dispatch<SetStateAction<string>>;

	selectedNFTs: NFT[];
	setSelectedNFTs: Dispatch<SetStateAction<NFT[]>>;

	pools: Pool[];
	setPools: Dispatch<SetStateAction<Pool[]>>;
};

type NFTProviderProps = NFTContextType & NFTCollection;

export const NFTContext = createContext<NFTProviderProps>(
	{} as NFTProviderProps,
);

let address = DEPLOYMENT_ADDRESSES.xexadon[80002];

export function NFTContextProvider({ children }: { children: ReactNode }) {
	const [nftAddress, setNftAddress] = useState<string>(address);
	const [collection, setCollection] = useState<any | null>(null);
	const [collectionName, setCollectionName] = useState<string>("");
	const [selectedNFTs, setSelectedNFTs] = useState<NFT[]>([]);
	const [pools, setPools] = useState<Pool[]>([]);

	return (
		<NFTContext.Provider
			value={{
				nftAddress,
				setNftAddress,
				collection,
				setCollection,
				collectionName,
				setCollectionName,
				selectedNFTs,
				setSelectedNFTs,
				pools,
				setPools
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
