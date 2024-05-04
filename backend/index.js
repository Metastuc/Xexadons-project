const express = require("express");
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const ethers = require('ethers');
require('dotenv').config();

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
  80002: "https://rpc-amoy.polygon.technology"
}

const raribleApiKey = process.env.RARIBLE_APIKEY;

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
  app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
  });
};

app.get("/", (req, res) => {
  res.send("Hello Xexadon!");
});

app.get("/getUserCollections", async(req, res) => {
  const userAddress = req.query.userAddress;
  const chain = req.query.chain;

  var userCollections = [];
  const options = {
    method: 'GET',
    url: `https://testnet-api.rarible.org/v0.1/collections/byOwner?blockchains=${chain}&owner=ETHEREUM%3A${userAddress}`,
    headers: {
      accept: 'application/json',
      'X-API-KEY': raribleApiKey
    }
  };

  try {
    const response = await axios(options);
    const collections = response.data.collections;
    for (let i = 0; i < collections.length; i++) {
      // check if type is 721
      if (collections[i].type == "ERC721" && collections[i].id.includes(chain)) {
        const collection = {
          name: collections[i].name,
          symbol: collections[i].symbol,
          address: collections[i].id.match(/0x[a-fA-F0-9]{40}/)[0],
          image: collections[i].meta.content[0].url
        }
        userCollections.push(collection);
      }
    }
    // Return the userCollections array as the response
    res.status(200).json(userCollections);
  } catch (error) {
    // Handle errors
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
    console.error('Error in /getPoolNFTs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/getCollection", async(req, res) => {
  const collectionAddress = req.query.collectionAddress;
  const chainId = req.query.chainId;

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
        url: `https://testnet-api.rarible.org/v0.1/items/byOwnerWithOwnership?owner=ETHEREUM%3A${poolAddresses[i]}`,
        headers: {
          accept: 'application/json',
          'X-API-KEY': raribleApiKey
        }
      };

      const response = await axios(options);
      const items = response.data.items;

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
        const meta = await nftContract.tokenURI(items[j].item.tokenId);
        console.log(nftContract, items[j]);
        const nft = {
          id: items[j].item.tokenId,
          name: items[j].item.itemCollection.name,
          poolAddress: poolAddresses[i],
          src: meta
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

app.post("recordActivity/:poolId", async(req, res) => {
  const poolId = req.params.poolId;
  try {
    const activity = {
      event: req.body.event,
      item: {
        image: req.body.itemImage,
        name: req.body.itemName,
      },
      price: req.body.price,
      from: req.body.from,
      from: req.body.to,
      time: new Date().toISOString(),
      hash: req.body.hash
    }
    const activityRef = db.collection('poolActivity').doc(poolId).collection('activities');
    await activityRef.add(activity);

    res.status(200).json({ response: "successful"});
  } catch (error) {
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

app.get("/getUser", async(req, res) => {
  const userAddress = req.query.userAddress;
  const chain = req.query.chain;

  try {
    const userPools = await getUserPools(userAddress, chain);
    const userNFTs = await getUserNFTs(userAddress);
    const userBalnce = await getUserBalance(userAddress, chain);

    const userObject = {
      userPools: userPools,
      userNFTs: userNFTs
    }

    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

async function getUserBalance(address, chain) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrls.testnets[chain]);

    const balanceWei = await provider.getBalance(address);

    const balanceEth = ethers.parseEther(balanceWei.toString());


    const options = {
      method: 'GET',
      url: 'https://api.rarible.org/v0.1/currencies/ETHEREUM%3A0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/rates/usd?at=2022-01-01T12%3A00%3A00Z',
      headers: {
        accept: 'application/json',
        'X-API-KEY': '5038109f-4d25-4d86-9e77-df64196caac4'
      }
    };

    const response = await axios(options);

  } catch (error) {
    
  }

  const balance = await provider.getBalance(address);

  // Convert the balance to Ether
  const etherBalance = ethers.utils.formatEther(balance);
}

async function getUserPools(address, chain) {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrls.testnets[chain]);

    const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);
    const userPools = await factoryContract.getUserPairss(address);
    
    var pools = [];

    for (let i = 0; i < userPools.length; i++) {
      const pairContract = new ethers.Contract(userPools[i], ABIs.pairABI, provider);
      const poolOwner = await pairContract.owner();
      const reserve0 = await pairContract.reserve0();
      const reserve1 = await pairContract.reserve1();

      const curveContract = new ethers.Contract(deploymentAddresses.curve.testnets[chain], ABIs.curveABI, provider);
      // use function that returns only one uint
      const buyPrice = await curveContract.getBuyPrice(1, reserve0, reserve1, userPools[i]);
      const sellPrice = await curveContract.getSellAmount(1, reserve0, reserve1, userPools[i]);

      const pool = {
        poolAddress: poolAddresses[i],
        owner: poolOwner,
        buyPrice: buyPrice[0],
        sellPrice: sellPrice[0],
        nftAmount: reserve0,
        tokenAmount: reserve1
      }

      pools.push(pool);
    }

    return pools;

  } catch (error) {
    return error;
  }
}

async function getUserNFTs(address) {
  const userNFTs = [];
  try {
    const options = {
      method: 'GET',
      url: `https://testnet-api.rarible.org/v0.1/items/byOwnerWithOwnership?owner=ETHEREUM%3A${address}`,
      headers: {
        accept: 'application/json',
        'X-API-KEY': raribleApiKey
      }
    };

    const response = await axios(options);
    const items = response.data.items;

    for (let j = 0; j < items.length; j++) {
      const nft = {
        id: items[j].tokenId,
        name: collectionName + " " + "#" + items[j].tokenId,
        poolAddresses: poolAddresses[i],
        image: items[j].meta.content[0].url
      };

      userNFTs.push(nft);
    }
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

      if (maxNFTs <= 0) {
        continue;
      }

      if (maxNFTs >= tokens) {
        const route = {
          poolAddress: poolAddresses[i],
          tokenLength: tokens
        }
        routes.push(route);
      } else {
        const route = {
          poolAddress: poolAddresses[i],
          tokenLength: tokenLength
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

startServer();