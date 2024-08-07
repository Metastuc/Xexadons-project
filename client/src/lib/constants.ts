export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID!;

export const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID!;

export const DEPLOYMENT_ADDRESSES = {
	factory: {
		80002: "0x615A1bae9c0DA60F32eA6B3C3ad4793ab9207423",
		97: "0xE7691bec5E7B442f8256f3924cb0836c5d7a77DA"
	},
	curve: {
		80002: "0x8c54cbb9e358888B902725593a5006A96a8C9551",
		97: "0xc9c0FeFfc23A5F867aef994Ada4821Cfd9549dA4"
	},
	router: {
		80002: "0xe9E3b91C58ACcc2EeA22323da2C7594dE75Ffd43",
		97: "0x77564393EC0C53f2d97D6A3b1D51E6F93bDD8620"
	},
	xexadon: {
		80002: "0xC616fDfBF0008F82433E287279FC99434A7164f8",
		97: "0x8E38c348f27C451996735a48766F705495D36a9b"
	} as DeploymentAddresses
};

interface DeploymentAddresses {
    [key: string]: string;
}