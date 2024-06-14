import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getNFTCollections(chain: number, address: string): Promise<any> {
	let URL: string, RESPONSE: any;

	URL = `${API_URL}getCollection?chainId=${chain}&collectionAddress=${address}`;

	try {
		RESPONSE = await axios.get(URL);
		console.log(RESPONSE.data);
		return RESPONSE.data;
	} catch (error) {
		console.error(`error trying to fetch nft collections: ${error}`);
		throw error;
	}
}

export async function getPoolNFTs(chain: number, address: string, poolAddress: string): Promise<any> {
	let URL: string, RESPONSE: any;

	URL = `${API_URL}getPoolNFTs?chainId=${chain}&nftAddress=${address}&poolAddress=${poolAddress}`;

	try {
		RESPONSE = await axios.get(URL);
		console.log(RESPONSE.data);
		return RESPONSE.data;
	} catch (error) {
		console.error(`error trying to fetch nft collections: ${error}`);
		throw error;
	}
}

export async function getUserCollectionNFTs(chain: number, address: string, userAddress: `0x${string}`, poolAddress: string,  tab: string): Promise<any> {
	let URL: string, RESPONSE: any;

	if (tab === "sell") {
		URL = `${API_URL}getUserCollectionNFTsSell?chainId=${chain}&nftAddress=${address}&userAddress=${userAddress}`;
	} else {
		URL = `${API_URL}getUserCollectionNFTsDeposit?chainId=${chain}&nftAddress=${address}&userAddress=${userAddress}&poolAddress=${poolAddress}`;
	}

	try {
		RESPONSE = await axios.get(URL);
		console.log(RESPONSE.data);
		return RESPONSE.data;
	} catch (error) {
		console.error(`error trying to fetch user collection NFTs: ${error}`);
		throw error;
	}
}

export async function getUserNFTs(chain: number, address: string, userAddress: `0x${string}`): Promise<any> {
	let URL: string, RESPONSE: any;

	URL = `${API_URL}getUserCollectionNFTsSell?chainId=${chain}&nftAddress=${address}&userAddress=${userAddress}`;

	try {
		RESPONSE = await axios.get(URL);
		console.log(RESPONSE.data);
		return RESPONSE.data;
	} catch (error) {
		console.error(`error trying to fetch user collection NFTs: ${error}`);
		throw error;
	}
}

export async function getUserPools(chainId: number, userAddress: string): Promise<any> {
    let URL: string, RESPONSE: any;

    URL = `${API_URL}getUserPools?chainId=${chainId}&userAddress=${userAddress}`;

    try {
        RESPONSE = await axios.get(URL);
        console.log(RESPONSE.data);
        return RESPONSE.data;
    } catch (error) {
        console.error(`Error trying to fetch user pools: ${error}`);
        throw error;
    }
}

export async function getUser(chainId: number, userAddress: string): Promise<any> {
    let URL: string, RESPONSE: any;

    URL = `${API_URL}getUser?chainId=${chainId}&userAddress=${userAddress}`;

    try {
        RESPONSE = await axios.get(URL);
        console.log(RESPONSE.data);
        return RESPONSE.data;
    } catch (error) {
        console.error(`Error trying to fetch user data: ${error}`);
        throw error;
    }
}

export async function getUserCollections(chainId: number, userAddress: string): Promise<any> {
    let URL: string, RESPONSE: any;

    URL = `${API_URL}getUserCollections?chainId=${chainId}&userAddress=${userAddress}`;

    try {
        RESPONSE = await axios.get(URL);
        console.log(RESPONSE.data);
        return RESPONSE.data;
    } catch (error) {
        console.error(`Error trying to fetch user collections: ${error}`);
        throw error;
    }
}

export async function getPoolActivity(poolId: string): Promise<any> {
    let URL: string, RESPONSE: any;

    URL = `${API_URL}getPoolActivity?poolId=${poolId}`;

    try {
        RESPONSE = await axios.get(URL);
        console.log(RESPONSE.data);
        return RESPONSE.data;
    } catch (error) {
        console.error(`Error trying to fetch pool activity: ${error}`);
        throw error;
    }
}