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

type buyPrice = {
	poolAddress: string;
	nextPrice: string;
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

	buyAmount: number;
	setBuyAmount: Dispatch<SetStateAction<number>>;

	sellAmount: number;
	setSellAmount: Dispatch<SetStateAction<number>>;

	depositAmount: number;
	setDepositAmount: Dispatch<SetStateAction<number>>;

	dollarAmount: number;
	setDollarAmount: Dispatch<SetStateAction<number>>;

	buyPrices: buyPrice[];
	setBuyPrices: Dispatch<SetStateAction<buyPrice[]>>;

	nextSellPrice: string;
	setNextSellPrice: Dispatch<SetStateAction<string>>;

	poolAddress: string;
	setPoolAddress: Dispatch<SetStateAction<`0x${string}`>>;

	userBalance: number | undefined;
	setUserBalance: Dispatch<SetStateAction<number | undefined>>
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
	const [buyAmount, setBuyAmount] = useState<number>(0);
	const [sellAmount, setSellAmount] = useState<number>(0);
	const [depositAmount, setDepositAmount] = useState<number>(0);
	const [dollarAmount, setDollarAmount] = useState<number>(0);
	const [buyPrices, setBuyPrices] = useState<buyPrice[]>([]);
	const [nextSellPrice, setNextSellPrice] = useState<string>(" ");
	const [poolAddress, setPoolAddress] = useState<`0x${string}`>("0x48bDf8aD32FAcE0Bb3887D4c771A184383864260");
	const [userBalance, setUserBalance] = useState<number | undefined>(0);

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
				poolAddress,
				setPoolAddress,
				userBalance,
				setUserBalance
			}}
		>
			{children}
		</NFTContext.Provider>
	);
}
