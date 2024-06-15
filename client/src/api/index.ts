/* eslint-disable indent */
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
let URL: string, RESPONSE: any;

export async function getNFTCollections(chain: number, address: string): Promise<any> {
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

export async function getUserCollections(chainId: number, userAddress: string): Promise<any> {
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