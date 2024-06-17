"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

import { DEPLOYMENT_ADDRESSES } from "@/lib";
import { NFTprops } from "@/types";

type NFTContextType = {
	nftAddress: string;
	setNftAddress: Dispatch<SetStateAction<string>>;
};

type NFTCollection = {
	collection: any;
	setCollection: Dispatch<SetStateAction<any>>;

	collectionName: string;
	setCollectionName: Dispatch<SetStateAction<string>>;

	selectedNFTs: NFTprops[];
	setSelectedNFTs: Dispatch<SetStateAction<NFTprops[]>>;
};

type NFTPrices = {
	buyAmount: number;
	setBuyAmount: Dispatch<SetStateAction<number>>;

	sellAmount: number;
	setSellAmount: Dispatch<SetStateAction<number>>;

	depositAmount: number;
	setDepositAmount: Dispatch<SetStateAction<number>>;

	dollarAmount: number;
	setDollarAmount: Dispatch<SetStateAction<number>>;
};

type NFTProviderProps = NFTContextType & NFTCollection & NFTPrices;

export const NFTContext = createContext<NFTProviderProps>({} as NFTProviderProps);

let address = DEPLOYMENT_ADDRESSES.xexadon[80002];

export function NFTContextProvider({ children }: { children: ReactNode }) {
	const [nftAddress, setNftAddress] = useState<string>(address);
	const [collection, setCollection] = useState<any | null>(null);
	const [collectionName, setCollectionName] = useState<string>("");
	const [selectedNFTs, setSelectedNFTs] = useState<NFTprops[]>([]);
	const [buyAmount, setBuyAmount] = useState<number>(0);
	const [sellAmount, setSellAmount] = useState<number>(0);
	const [depositAmount, setDepositAmount] = useState<number>(0);
	const [dollarAmount, setDollarAmount] = useState<number>(0);

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

				buyAmount,
				setBuyAmount,

				sellAmount,
				setSellAmount,

				depositAmount,
				setDepositAmount,

				dollarAmount,
				setDollarAmount,
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
