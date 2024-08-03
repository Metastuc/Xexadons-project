export interface NFTprops {
    address: string;
    id: number;
    poolAddress: string;
}

export interface Pool {
    poolAddress: string,
    owner: string,
    buyPrice: number,
    sellPrice: number,
    nftAmount: number,
    tokenAmount: number,
    feesEarned: number
};

export interface BuyPrice {
    poolAddress: string;
    nextPrice: string;
}