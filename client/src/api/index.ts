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