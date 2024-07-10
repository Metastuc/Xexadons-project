"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

import { DEPLOYMENT_ADDRESSES } from "@/lib";
import { BuyPrice, NFTprops, Pool } from "@/types";

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

	collectionNfts: any[];
	setCollectionNfts: Dispatch<SetStateAction<any[]>>;

	pools: Pool[];
	setPools: Dispatch<SetStateAction<Pool[]>>;

	poolAddress: string;
	setPoolAddress: Dispatch<SetStateAction<`0x${string}`>>;

	userCollectionAddress: string;
	setUserCollectionAddress: Dispatch<SetStateAction<string>>;
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

	buyPrices: BuyPrice[];
	setBuyPrices: Dispatch<SetStateAction<BuyPrice[]>>;

	nextSellPrice: string;
	setNextSellPrice: Dispatch<SetStateAction<string>>;
};

type NFTProviderProps = NFTContextType & NFTCollection & NFTPrices;

export const NFTContext = createContext<NFTProviderProps>({} as NFTProviderProps);

let address = DEPLOYMENT_ADDRESSES.xexadon[80002];

export function NFTContextProvider({ children }: { children: ReactNode }) {
	const [nftAddress, setNftAddress] = useState<string>(address);
	const [poolAddress, setPoolAddress] = useState<`0x${string}`>(
		"0x6a13d552528B0C53f4007A9cb847358ee8A50f9a",
	);
	const [collection, setCollection] = useState<any | null>(null);
	const [collectionName, setCollectionName] = useState<string>("");
	const [selectedNFTs, setSelectedNFTs] = useState<NFTprops[]>([]);
	const [collectionNfts, setCollectionNfts] = useState<any[]>([]);
	const [buyAmount, setBuyAmount] = useState<number>(0);
	const [sellAmount, setSellAmount] = useState<number>(0);
	const [depositAmount, setDepositAmount] = useState<number>(0);
	const [dollarAmount, setDollarAmount] = useState<number>(0);
	const [pools, setPools] = useState<Pool[]>([]);
	const [buyPrices, setBuyPrices] = useState<BuyPrice[]>([]);
	const [nextSellPrice, setNextSellPrice] = useState<string>(" ");
	const [userCollectionAddress, setUserCollectionAddress] = useState<string>("");

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

				collectionNfts,
				setCollectionNfts,

				poolAddress,
				setPoolAddress,

				userCollectionAddress,
				setUserCollectionAddress,

				pools,
				setPools,

				buyAmount,
				setBuyAmount,

				sellAmount,
				setSellAmount,

				depositAmount,
				setDepositAmount,

				dollarAmount,
				setDollarAmount,

				buyPrices,
				setBuyPrices,

				nextSellPrice,
				setNextSellPrice,
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
