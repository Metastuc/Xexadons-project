/* eslint-disable indent */
import axios, { AxiosResponse } from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
let URL: string, RESPONSE: AxiosResponse<any, any>;


/**
 * A reusable Axios function that makes HTTP requests.
 * @param {string} url - The URL for the request.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {object} params - The parameters to be sent with the request.
 * @param {object} headers - The headers to be sent with the request.
 * @param {object} data - The data to be sent with the request (for POST, PUT, etc.).
 * @returns {Promise} - The Axios promise for the HTTP request.
 */
async function makeRequest({ url = "", method = 'GET', params = {}, headers = {}, data = {} }): Promise<any> {
    try {
        const response = await axios({
            url,
            method,
            params,
            headers,
            data
        });
        return response.data;
    } catch (error) {
        console.error('Error making request:', error);
        throw error;
    }
};

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
    try {
        const RESPONSE = await makeRequest(
            {
                url: `${API_URL}/getUserCollections`,
                method: 'GET',
                // params: { chainId: 97, userAddress: "0x72De66bFDEf75AE89aD98a52A1524D3C5dB5fB24" }
                params: { chainId, userAddress }
            }
        );

        return RESPONSE || [];
    } catch (error) {
        console.error(`Error trying to fetch user collections: ${error}`);
        throw error;
    }
}