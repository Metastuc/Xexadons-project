"use client";

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

import { DEPLOYMENT_ADDRESSES } from "@/lib";

type NFTContextType = {
	nftAddress: string;
	setNftAddress: Dispatch<SetStateAction<string>>;
};

type NFTCollection = {
	collection: any;
	setCollection: Dispatch<SetStateAction<any>>;

	collectionName: string;
	setCollectionName: Dispatch<SetStateAction<string>>;
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

	return (
		<NFTContext.Provider
			value={{
				nftAddress,
				setNftAddress,
				collection,
				setCollection,
				collectionName,
				setCollectionName,
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
