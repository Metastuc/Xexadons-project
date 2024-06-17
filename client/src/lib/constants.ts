export const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID!;

export const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID!;

export const DEPLOYMENT_ADDRESSES = {
	factory: {
		80002: "0x63f52C7d448cFdd3ED6F8B4Ad92272B1419895b0",
		97: "0xFa2C0D7AD5bf7259F564380D707cF95683CBe264"
	},
	curve: {
		80002: "0x471367B20F644E058F7092a34b2d2Ea90B26BB0d",
		97: "0xCc045dCb5C6FEf4273B498e0c364f760F0415997"
	},
	router: {
		80002: "0x7937b7787E1236685162EedE657b9d631025F2Fb",
		97: "0x5C67Bf96A7508bFf7a8B3bfe53E6108066F7b41E"
	},
	xexadon: {
		80002: "0x64dCb39317940d74b711eCE72595b6a80D37B8ad",
		97: "0x5f74e9D1EDA4fcd81B2Aa9C842eB1EE47561f70d"
	}
};