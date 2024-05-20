const express = require("express");
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const ethers = require('ethers');
require('dotenv').config();

const Moralis = require("moralis").default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const credentialPath = process.env.CREDPATH;
const serviceAccount = require(credentialPath);

const ABIs = {
  factoryABI: [
      {
          "inputs": [],
          "name": "getPoolCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "pairPools",
          "outputs": [
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "pairAddress",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            }
          ],
          "name": "getPairs",
          "outputs": [
            {
              "internalType": "address[]",
              "name": "pairs",
              "type": "address[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getUserPairs",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "userPairs",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "getPair",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
  ],
  pairABI: [
      {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
        "inputs": [],
        "name": "reserve0",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "reserve1",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
  ],
  curveABI: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenLength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserve0",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserve1",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "pairAddress",
          "type": "address"
        }
      ],
      "name": "getBuyPriceSingle",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenLength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserve0",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "reserve1",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "pairAddress",
          "type": "address"
        }
      ],
      "name": "getSellAmountSingle",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ],
  nftABI: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
  ]
}

const deploymentAddresses = {
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
}

const rpcUrls = {
  80002: "https://rpc-amoy.polygon.technology",
  97: "https://data-seed-prebsc-1-s1.bnbchain.org:8545"
}

const tokenAddresses = {
  80002: "0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43",
  97: " "
}

const explorerUrls = {
  80002: "https://polygonscan.com/tx/",
  92: "https://polygonscan.com/tx/"
}

const currencies = {
  80002: "matic",
  92: "bnb"
}

const chainNames = {
  80002: "polygon-amoy",
  97: "bsc-testnet"
}

const raribleApiKey = process.env.RARIBLE_APIKEY;
const moralisApiKey = process.env.MORALIS_API_KEY;
const simpleHashKey = process.env.SIMPLEHASH_API_KEY;

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

const startServer = async () => {
  await Moralis.start({
    apiKey: moralisApiKey,
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
  });
};

app.get("/", (req, res) => {
  res.send("Hello Xexadon!");
});

app.get("/getUserCollections", async(req, res) => {
  const userAddress = req.query.userAddress;
  const chain = req.query.chainId;

  try {
    const userCollections = await getUserCollections(userAddress, chain)
    res.status(200).json(userCollections);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getUserCollectionNFTs", async(req, res) => {
  // include chain param
  const userAddress = req.query.userAddress;
  const chainId = req.query.chainId;
  const nftAddress = req.query.nftAddress;
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);

  const nftContract = new ethers.Contract(nftAddress, ABIs.nftABI, provider);
  const nftName = await nftContract.name();
  const icon = await nftContract.tokenURI(0);
  console.log(nftName);

  var userCollectionNFTs = [];
  const options = {
    method: 'GET',
    url: `https://testnet-api.rarible.org/v0.1/items/byOwnerWithOwnership?owner=ETHEREUM%3A${userAddress}`,
    headers: {
      accept: 'application/json',
      'X-API-KEY': raribleApiKey
    }
  };

  try {
    const response = await axios(options);
    const items = response.data.items;
    console.log(items);

    // check if contract address matches tokenAddress
    for (let i = 0; i < items.length; i++) {
      const name = items[i].item.itemCollection.name;
      // console.log(name);
      const meta = await nftContract.tokenURI(items[i].item.tokenId);
      if (nftName === name) {
        const nft = {
          id: items[i].item.tokenId,
          name: nftName,
          src: meta
        }
        userCollectionNFTs.push(nft);
      }
    }
    const collection = {
      icon: icon,
      nfts: userCollectionNFTs
    }
    // Return the userCollections array as the response
    res.status(200).json(collection);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getProtocolCollections", async (req, res) => {
  try {
    const chainId = req.query.chainId;
    const factoryAddress = deploymentAddresses.factory[chainId];
    const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);

    var collectionAddresses = [];
    var collections = [];

    const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);
    const length = await factoryContract.getPoolCount();
    console.log(length);
    for (let i = 0; i < length; i++) {
      const pool = await factoryContract.pairPools(i);
      console.log(pool[0]);
      const poolAddress = pool[0];
      collectionAddresses.push(poolAddress);
    }

    for (let i = 0; i < collectionAddresses.length; i++) {
      try {
        const collectionContract = new ethers.Contract(collectionAddresses[i], ABIs.nftABI, provider);
        const name = await collectionContract.name();
        const image = await collectionContract.tokenURI(0);
        const collection = {
          address: collectionAddresses[i],
          name: name,
          image: image
        };

        collections.push(collection);
      } catch (error) {
        console.error(`Error fetching collection details for address ${collectionAddresses[i]}:`, error);
      }
    }

    res.status(200).json(collections);
  } catch (error) {
    console.error('Error in /getProtocolCollections', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/getCollection", async(req, res) => {
  const collectionAddress = req.query.collectionAddress;
  const chainId = req.query.chainId;
  console.log(chainId);

  const factoryAddress = deploymentAddresses.factory[chainId];
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);

  const nftContract = new ethers.Contract(collectionAddress, ABIs.nftABI, provider);
  const icon = await nftContract.tokenURI(0);

  var pools = [];
  var poolAddresses;
  var NFTs = [];

  try {
    const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);
    poolAddresses = await factoryContract.getPairs(collectionAddress);
    console.log(poolAddresses, poolAddresses[0]);

    for (let i = 0; i < poolAddresses.length; i++) {
      const options = {
        method: 'GET',
        url: `https://api.simplehash.com/api/v0/nfts/owners?chains=${chainNames[chainId]}&wallet_addresses=${poolAddresses[i]}&contract_addresses=${collectionAddress}`,
        headers: {
          accept: 'application/json',
          'X-API-KEY': simpleHashKey
        }
      };

      const response = await axios(options);
      const items = response.data.nfts;

      const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);
      const reserve0 = await pairContract.reserve0();
      const reserve1 = await pairContract.reserve1();

      const pool = {
        poolAddress: poolAddresses[i].toString(),
        reserve0: Number(reserve0),
        reserve1: Number(reserve1)
      }

      pools.push(pool);

      for (let j = 0; j < items.length; j++) {
        const imageUrl = items[j].image_url;
        const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);

        const reserve0 = await pairContract.reserve0();
        const reserve1 = await pairContract.reserve1();
  
        const curveContract = new ethers.Contract(deploymentAddresses.curve[chainId], ABIs.curveABI, provider);
  
        // use function that returns only one uint
        const buyPrice = await curveContract.getBuyPriceSingle(1, reserve0, reserve1, poolAddresses[i]);
        const _buyPrice = roundDownToTwoDecimals(Number(ethers.formatEther(buyPrice))) + currencies[chainId];
        const nft = {
          id: items[j].token_id,
          name: items[j].collection.name,
          poolAddress: poolAddresses[i],
          src: imageUrl,
          address: collectionAddress,
          price: _buyPrice
        };
        NFTs.push(nft);
      }
    }

    const collection = {
      icon: icon,
      pools: pools,
      NFTs: NFTs,
    }

    console.log(collection);
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ error: error })
    console.log(error);
  }
});

app.post("/recordActivity/:poolId", async(req, res) => {
  const poolId = req.params.poolId;
  console.log(`Received request for poolId: ${poolId}`);
  try {
    const link = explorerUrls[req.body.chainId] + req.body.hash;
    const provider = new ethers.JsonRpcProvider(rpcUrls[req.body.chainId]);
    const nftContract = new ethers.Contract(req.body.address, ABIs.nftABI, provider);
    const itemImage = await nftContract.tokenURI(req.body.item);

    const activity = {
      event: req.body.event,
      item: itemImage,
      price: req.body.price,
      from: req.body.from,
      to: req.body.to,
      time: new Date().toISOString(),
      link: link
    }
    const activityRef = db.collection('poolActivity').doc(poolId).collection('activities');
    await activityRef.add(activity);

    res.status(200).json({ response: "successful"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error })
  }
})

app.get("/getPoolActivity", async(req, res) => {
  const poolId = req.query.poolId;
  var allActivities = [];
  
  try {
    const activitySnapshot = await db.collection('poolActivity').doc(poolId).collection('activities').get();

    activitySnapshot.forEach((doc) => {
      allActivities.push(doc.data());
    });

    const activities = sortActivities(allActivities);

    res.status(200).json({ response: activities });
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }
});

app.get("/getUserPools", async(req, res) => {
  const chainId = req.query.chainId;
  const userAddress = req.query.userAddress;

  try {
    const userPools = await getUserPools(userAddress, chainId);
    res.status(200).json(userPools);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
})

async function getUserPools(address, chain) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrls[chain]);

    const factoryContract = new ethers.Contract(deploymentAddresses.factory[chain], ABIs.factoryABI, provider);
  
    const userPools = await factoryContract.getUserPairs(address);
    console.log(userPools);

    var pools = [];

    for (let i = 0; i < userPools.length; i++) {
      const pairContract = new ethers.Contract(userPools[i], ABIs.pairABI, provider);

      const poolOwner = await pairContract.owner();
      const reserve0 = await pairContract.reserve0();
      const _reserve0 = Number(reserve0);
      const reserve1 = await pairContract.reserve1();
      const _reserve1 = Number(ethers.parseEther(reserve1.toString()));

      const curveContract = new ethers.Contract(deploymentAddresses.curve[chain], ABIs.curveABI, provider);

      // use function that returns only one uint
      const buyPrice = await curveContract.getBuyPriceSingle(1, reserve0, reserve1, userPools[i]);
      const _buyPrice = Number(ethers.parseEther(buyPrice.toString()));
      const sellPrice = await curveContract.getSellAmountSingle(1, reserve0, reserve1, userPools[i]);
      const _sellPrice = Number(ethers.parseEther(sellPrice.toString()));

      const pool = {
        poolAddress: userPools[i],
        owner: poolOwner,
        buyPrice: _buyPrice,
        sellPrice: _sellPrice,
        nftAmount: _reserve0,
        tokenAmount: _reserve1
      }

      pools.push(pool);
    }

    console.log(pools);
    return pools;

  } catch (error) {
    console.log(error);
    return error;
  }
}

app.get("/getUser", async(req, res) => {
  const userAddress = req.query.userAddress;
  const chainId = req.query.chainId;

  try {
    const userCollections = await getUserCollections(userAddress, chainId);
    const userBalance = await getUserBalance(userAddress, chainId);

    const userObject = {
      userCollections: userCollections,
      userBalance: userBalance
    }

    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

async function getUserBalance(userAddress, chainId) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
    const address = tokenAddresses[chainId];
    
    const balanceWei = await provider.getBalance(userAddress);
    const _balanceEth = ethers.parseEther(balanceWei.toString());
    const balanceEth = Number(_balanceEth);

    const response = await Moralis.EvmApi.token.getTokenPrice({
      "chain": EvmChain.ETHEREUM,
      "address": address
    });
  
    const price = response.raw.usdPrice;
    const dollarWorth = balanceEth * price;

    const nativeBalance = Math.floor(balanceEth);
    const dollarBalance = Math.floor(dollarWorth);

    const balance = {
      nativeBalance: nativeBalance,
      dollarBalance: dollarBalance
    }

    console.log(balance);
    return balance;

  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserCollections(address, chainId) {
  let userCollections;
  let userNFTs = []
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
  const options = {
    method: 'GET',
    url: `https://testnet-api.rarible.org/v0.1/items/byOwnerWithOwnership?owner=ETHEREUM%3A${address}`,
    headers: {
      accept: 'application/json',
      'X-API-KEY': raribleApiKey
    }
  };
  try {
    const response = await axios(options);
    const items = response.data.items;

    for (let i = 0; i < items.length; i++) {
      const collectionAddress = items[i].item.collection
      const nftAddress = collectionAddress.slice(8);
      const nftContract = new ethers.Contract(nftAddress, ABIs.nftABI, provider);
      const name = items[i].item.itemCollection.name;
      const image = await nftContract.tokenURI(0);
      const nft = {
        address: nftAddress,
        name: name,
        image: image
      }
      userNFTs.push(nft);
    }
    const uniqueNFTMap = new Map();

    userNFTs.forEach(nft => {
      const key = `${nft.name}-${nft.image}`;
      if (!uniqueNFTMap.has(key)) {
        uniqueNFTMap.set(key, nft);
      }
    });
    
    userCollections = Array.from(uniqueNFTMap.values());

    console.log(userCollections);
    return userCollections;

  } catch (error) {
    return error;
  }
}

function sortActivities(activities) {
  // Filter events to include only objects from the past 7 days
  const filteredEvents = activities.filter(activity => {
    const activityTime = new Date(activity.time);
    const now = new Date();
    const diffInDays = Math.floor((now - activityTime) / (1000 * 60 * 60 * 24));
    return diffInDays <= 7;
  });

  // Sort filteredEvents based on the time parameter
  filteredEvents.sort((a, b) => new Date(a.time) - new Date(b.time));

  return filteredEvents;
}

app.get("/getSellPrice", async (req, res) => {
  const tokenLength = req.query.tokenLength;
  const nftAddress = req.query.nftAddress;
  const chainId = req.query.chainId;

  const factoryAddress = deploymentAddresses.factory[chainId];
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
  console.log(chainId, factoryAddress);

  const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);

  let sellAmount = 0;

  try {
    const poolAddresses = await factoryContract.getPairs(nftAddress);
    let tokens = tokenLength;

    for (let i = 0; i < poolAddresses.length; i++) {
      const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);
      const _reserve0 = await pairContract.reserve0();
      const _reserve1 = await pairContract.reserve1();

      const reserve0 = Number(_reserve0);
      const reserve1 = Number(_reserve1);

      const amountOut = reserve1 * 0.7;
      
      const tokenLength = (amountOut * reserve0) / (reserve1 - amountOut);
      const maxNFTs = Math.floor(tokenLength);

      if (maxNFTs <= 0) {
        continue;
      }

      if (maxNFTs >= tokenLength) {
        const amountOut = ((reserve1 * tokenLength) / (reserve0 + tokenLength));
        sellAmount = sellAmount + amountOut;
      } else {
        tokens = tokens - maxNFTs;
        const amountOut = ((reserve1 * maxNFTs) / (reserve0 + maxNFTs));
        sellAmount = sellAmount + amountOut;
      }
    }

    res.json({ sellAmount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get("/getSellRoute", async(req, res) => {
  const tokenLength = req.query.tokenLength;
  const nftAddress = req.query.nftAddress;
  const chainId = req.query.chainId;

  const factoryAddress = deploymentAddresses.factory[chainId];
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
  console.log(chainId, factoryAddress);

  const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);

  let routes = [];

  try {
    const poolAddresses = await factoryContract.getPairs(nftAddress);
    let tokens = tokenLength;

    for (let i = 0; i < poolAddresses.length; i++) {
      const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);
      const _reserve0 = await pairContract.reserve0();
      const _reserve1 = await pairContract.reserve1();

      const reserve0 = Number(_reserve0);
      const reserve1 = Number(_reserve1);

      const amountOut = reserve1 * 0.7;
      
      const tokenLength_ = (amountOut * reserve0) / (reserve1 - amountOut);
      const maxNFTs = Math.floor(tokenLength_);
      console.log("maxNFTs", maxNFTs);

      if (maxNFTs <= 0) {
        console.log("less than 0");
        continue;
      }

      if (maxNFTs >= tokens) {
        const route = {
          poolAddress: poolAddresses[i],
          tokenLength: tokens
        }
        routes.push(route);
        break;
      } else {
        const route = {
          poolAddress: poolAddresses[i],
          tokenLength: maxNFTs
        }
        routes.push(route);
        tokens = tokens - maxNFTs;
      }
    }

    res.json(routes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
})

app.get("/getCoinPrice", async(req, res) => {
  const chainId = req.query.chainId;

  const address = tokenAddresses[chainId];

  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      "chain": EvmChain.ETHEREUM,
      "address": address
    });
  
    const price = response.raw.usdPrice;
    res.status(200).json({ "price": price });
  } catch (error) {
    console.error('Error in /getCoinPrice', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

function roundDownToTwoDecimals(number) {
  const shiftedNumber = Math.floor(number * 100);
  const roundedNumber = shiftedNumber / 100;
  return roundedNumber.toFixed(2);
}

startServer();