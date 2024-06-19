export interface NFTprops {
    address: string;
    id: number;
    poolAddress: string;
}

export interface Pool {
    poolAddress: string;
    reserve0: number;
    reserve1: number;
};

export interface BuyPrice {
    poolAddress: string;
    nextPrice: string;
}