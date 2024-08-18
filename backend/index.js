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
        "name": "totalSupply",
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
        "name": "feeMultiplier",
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

const _moralisApiKey = process.env.MORALIS_API_KEY;
const moralisApiKey = removeEquals(_moralisApiKey);
const _simpleHashKey = process.env.SIMPLEHASH_API_KEY;
const simpleHashKey = removeEquals(_simpleHashKey);

const CREDENTIALS = JSON.parse(
  Buffer.from(process.env.CRED, 'base64').toString('utf-8')
);

initializeApp({
  credential: cert(CREDENTIALS),
});

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

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
    userCollections.poolAddress = "0x";

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
  var icon;
  
  var userCollectionNFTs = [];
  const options = {
    method: 'GET',
    url: `https://api.simplehash.com/api/v0/nfts/owners?chains=${chainNames[chainId]}&wallet_addresses=${userAddress}&contract_addresses=${nftAddress}`,
    headers: {
      'Authorization': 'Bearer ' + simpleHashKey,
      accept: 'application/json',
      'X-API-KEY': simpleHashKey
    }
  };

  try {
    const response = await axios(options);
    const items = response.data.nfts;
    console.log(items);

    // check if contract address matches tokenAddress
    for (let i = 0; i < items.length; i++) {
      const imageUrl = items[i].image_url;
      const nft = {
        id: items[i].token_id,
        name: items[i].collection.name,
        src: imageUrl
      }
      userCollectionNFTs.push(nft);
    }

    const collection = {
      NFTs: userCollectionNFTs,
    }

    res.status(200).json(collection);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getUserCollectionNFTsSell", async(req, res) => {
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
    url: `https://api.simplehash.com/api/v0/nfts/owners?chains=${chainNames[chainId]}&wallet_addresses=${userAddress}&contract_addresses=${nftAddress}`,
    headers: {
      'Authorization': 'Bearer ' + simpleHashKey,
      accept: 'application/json',
      'X-API-KEY': simpleHashKey
    }
  };

  try {
    const response = await axios(options);
    const items = response.data.nfts;
    console.log(items);

    const _price = await getSellPrice(1, nftAddress, chainId);
    const price = roundDownToTwoDecimals(_price);

    // check if contract address matches tokenAddress
    for (let i = 0; i < items.length; i++) {
      const imageUrl = items[i].image_url;
      const nft = {
        id: items[i].token_id,
        name: nftName,
        src: imageUrl,
        price: price
      }
      userCollectionNFTs.push(nft);
    }
    const collection = {
      icon: icon,
      pools: [],
      NFTs: userCollectionNFTs,
    }

    res.status(200).json(collection);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getUserCollectionNFTsDeposit", async(req, res) => {
  // include chain param
  const userAddress = req.query.userAddress;
  const chainId = req.query.chainId;
  const nftAddress = req.query.nftAddress;
  const poolAddress = req.query.poolAddress;

  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);

  const pairContract = new ethers.Contract(poolAddress, ABIs.pairABI, provider);
  const _reserve0 = await pairContract.reserve0();
  const _reserve1 = await pairContract.reserve1();
  console.log(_reserve0, _reserve1);
  const reserve0 = Number(_reserve0);
  const reserve1 = Number(_reserve1);
  // calculate amountIn
  const amount = reserve1 / reserve0;
  const depositAmount = (roundDownToTwoDecimals(Number(ethers.formatEther(BigInt(amount))))) + currencies[chainId];

  const nftContract = new ethers.Contract(nftAddress, ABIs.nftABI, provider);
  const nftName = await nftContract.name();
  const icon = await nftContract.tokenURI(0);

  var userCollectionNFTs = [];
  const options = {
    method: 'GET',
    url: `https://api.simplehash.com/api/v0/nfts/owners?chains=${chainNames[chainId]}&wallet_addresses=${userAddress}&contract_addresses=${nftAddress}`,
    headers: {
      accept: 'application/json',
      'X-API-KEY': simpleHashKey
    }
  };

  try {
    const response = await axios(options);
    const items = response.data.nfts;

    // check if contract address matches tokenAddress
    for (let i = 0; i < items.length; i++) {
      const imageUrl = items[i].image_url;
      const nft = {
        id: items[i].token_id,
        name: nftName,
        src: imageUrl,
        price: depositAmount
      }
      userCollectionNFTs.push(nft);
    }
    const collection = {
      icon: icon,
      pools: [],
      NFTs: userCollectionNFTs
    }

    res.status(200).json(collection);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user NFTs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getPoolNFTs", async(req, res) => {
  // include chain param
  const chainId = req.query.chainId;
  const nftAddress = req.query.nftAddress;
  const poolAddress = req.query.poolAddress;

  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);

  const nftContract = new ethers.Contract(nftAddress, ABIs.nftABI, provider);
  const nftName = await nftContract.name();
  const icon = await nftContract.tokenURI(0);

  const pairContract = new ethers.Contract(poolAddress, ABIs.pairABI, provider);
  const reserve1 = await pairContract.reserve1();

  const poolBalance = await provider.getBalance(poolAddress);
  const _feesEarned = poolBalance - reserve1;
  const feesEarned = Number(_feesEarned);

  var poolNFTs = [];
  const options = {
    method: 'GET',
    url: `https://api.simplehash.com/api/v0/nfts/owners?chains=${chainNames[chainId]}&wallet_addresses=${poolAddress}&contract_addresses=${nftAddress}`,
    headers: {
      accept: 'application/json',
      'X-API-KEY': simpleHashKey
    }
  };

  try {
    const response = await axios(options);
    const items = response.data.nfts;

    // check if contract address matches tokenAddress
    for (let i = 0; i < items.length; i++) {
      const imageUrl = items[i].image_url;
      const nft = {
        id: items[i].token_id,
        name: nftName,
        src: imageUrl,
        price: " "
      }
      poolNFTs.push(nft);
    }

    const collection = {
      icon: icon,
      pools: [],
      NFTs: poolNFTs,
      feesEarned: feesEarned
    }

    res.status(200).json(collection);
  } catch (error) {
    // Handle errors
    console.error("Error fetching pool NFTs:", error);
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

function removeEquals(str) {
  return str.replace(/=/g, '');
}

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
          'Authorization': 'Bearer ' + simpleHashKey,
          accept: 'application/json',
          'X-API-KEY': simpleHashKey
        }
      };

      const response = await axios(options);
      const items = response.data.nfts;

      const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);

      const poolOwner = await pairContract.owner();
      const reserve0 = await pairContract.reserve0();
      const _reserve0 = Number(reserve0);
      const reserve1 = await pairContract.reserve1();
      const _reserve1 = Number(ethers.formatEther(reserve1));

      const curveContract = new ethers.Contract(deploymentAddresses.curve[chainId], ABIs.curveABI, provider);

      // use function that returns only one uint
      const buyPrice = await curveContract.getBuyPriceSingle(1, reserve0, reserve1, poolAddresses[i]);
      const _buyPrice = Number(ethers.formatEther(buyPrice));
      const sellPrice = await curveContract.getSellAmountSingle(1, reserve0, reserve1, poolAddresses[i]);
      const _sellPrice = Number(ethers.formatEther(sellPrice));

      const feeRef = db.collection('FeesEarned').doc(poolAddresses[i]);
      const feeDoc = await feeRef.get();
      var feesEarned;
      if (feeDoc.exists) {
        feesEarned = feeDoc.data().fee;
      } else {
        feesEarned = 0;
      }

      const pool = {
        poolAddress: poolAddresses[i],
        owner: poolOwner,
        buyPrice: _buyPrice,
        sellPrice: _sellPrice,
        nftAmount: _reserve0,
        tokenAmount: _reserve1,
        feesEarned: feesEarned
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
        const _buyPrice = roundDownToTwoDecimals(Number(ethers.formatEther(buyPrice)));
        const nft = {
          id: Number(items[j].token_id),
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
    const poolContract = new ethers.Contract(poolId, ABIs.pairABI, provider);
    const itemImage = await nftContract.tokenURI(req.body.item);

    const _feeMultiplier = await poolContract.feeMultiplier();
    const feeMultiplier = Number(_feeMultiplier);
    const feeRef = db.collection('FeesEarned').doc(poolId);
    const feeDoc = await feeRef.get();
    if (feeDoc.exists) {
      const accumulatedFee = feeDoc.data().fee;
      const newFee = ((req.body.price * feeMultiplier) / 1000) + accumulatedFee;
      await feeRef.update({fees: newFee});
    } else {
      const fee = (req.body.price * feeMultiplier) / 1000;
      await feeRef.set(fee);
    }
    
    const price = (roundDownToTwoDecimals(req.body.price)) + currencies[req.body.chainId];
    const activity = {
      event: req.body.event,
      item: itemImage,
      price: price,
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
      console.log(doc.data());
      allActivities.push(doc.data());
    });

    const activities = sortActivities(allActivities);

    res.status(200).json( activities );
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

app.post("/recordCollection", async(req, res) => {
  const collectionId = req.query.collectionId;
  const chainId = req.query.chainId;
  try { 
    const chain = chainNames[chainId];
    const collectionsRef = db.collection('Collections');
    const options = {
      method: 'GET',
      url: `https://api.simplehash.com/api/v0/nfts/collections/${chain}/${collectionId}?limit=1`,
      headers: {
        'Authorization': 'Bearer ' + simpleHashKey,
        accept: 'application/json',
        'X-API-KEY': simpleHashKey
      }
    };
    const response = await axios(options);
    const imageUrl = response.data.collections[0].image_url;
    const name = response.data.collections[0].name;
    const collection = {
      collectionAddress: collectionId,
      collectionImage: imageUrl,
      collectionName: name,
      chain: chainId
    }
    await collectionsRef.add(collection);
    res.status(200).json({ response: "successful"});
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: error.message });
  }
})

app.get("/getAllCollections", async (req, res, next) => {
  const chainId = req.query.chainId;
  try {
    const collectionsRef = db.collection('Collections');
    
    const query = collectionsRef.where('chain', '==', chainId);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No collections found for the given chainId.' });
    }

    const collections = [];
    snapshot.forEach(doc => {
      collections.push(doc.data());
    });

    res.status(200).json(collections);
  } catch (error) {
    next(error); 
  }
});

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
      const _reserve1 = Number(ethers.formatEther(reserve1));

      const curveContract = new ethers.Contract(deploymentAddresses.curve[chain], ABIs.curveABI, provider);

      // use function that returns only one uint
      const buyPrice = await curveContract.getBuyPriceSingle(1, reserve0, reserve1, userPools[i]);
      const _buyPrice = Number(ethers.formatEther(buyPrice));
      const sellPrice = await curveContract.getSellAmountSingle(1, reserve0, reserve1, userPools[i]);
      const _sellPrice = Number(ethers.formatEther(sellPrice));

      const feeRef = db.collection('FeesEarned').doc(userPools[i]);
      const feeDoc = await feeRef.get();
      var feesEarned;
      if (feeDoc.exists) {
        const _feesEarned = feeDoc.data().fee;
        feesEarned = (roundDownToTwoDecimals(_feesEarned)) + currencies[chain];
      } else {
        feesEarned = 0 + currencies[chain];
      }

      const pool = {
        poolAddress: userPools[i],
        owner: poolOwner,
        buyPrice: _buyPrice,
        sellPrice: _sellPrice,
        nftAmount: _reserve0,
        tokenAmount: _reserve1,
        feesEarned: feesEarned
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
    const _balanceEth = ethers.formatEther(balanceWei);
    const balanceEth = Number(_balanceEth);

    const response = await Moralis.EvmApi.token.getTokenPrice({
      "chain": EvmChain.ETHEREUM,
      "address": address
    });
  
    const price = response.raw.usdPrice;
    const dollarWorth = balanceEth * price;

    const nativeBalance = Math.floor(balanceEth);
    const dollarBalance = Math.floor(dollarWorth);

    const balance = dollarBalance

    console.log(balance);
    return balance;

  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getUserCollections(address, chainId) {
  let userNFTs = []
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
  const chain = chainNames[chainId];
  const options = {
    method: 'GET',
    url: `https://api.simplehash.com/api/v0/nfts/collections_by_wallets_v2?chains=${chain}&wallet_addresses=${address}`,
    headers: {
      'Authorization': 'Bearer ' + simpleHashKey,
      accept: 'application/json',
      'X-API-KEY': simpleHashKey
    }
  };
  
  try {
    const response = await axios(options);
    const items = response.data.collections;

    console.log(items, items[0].collection_details.top_contracts);

    for (let i = 0; i < items.length; i++) {
      const _collectionAddress = items[i].collection_details.top_contracts[0];
      const parts = _collectionAddress.split('.');
      const collectionAddress = parts[1];
      const nftContract = new ethers.Contract(collectionAddress, ABIs.nftABI, provider);
      const name = items[i].collection_details.name;
      const image = await nftContract.tokenURI(0);
      const nft = {
        address: collectionAddress,
        name: name,
        image: image
      }
      userNFTs.push(nft);
    }

    return userNFTs;

  } catch (error) {
    return error;
  }
}

// Helper function to convert time to relative format
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.abs(now - past);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

function sortActivities(activities) {
  const updatedActivities = activities.map(transaction => ({
    ...transaction,
    time: timeAgo(transaction.time)
}));

  return updatedActivities;
}

const getSellPrice = async(length, collectionAddress, chainId) => {
  const factoryAddress = deploymentAddresses.factory[chainId];
  const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
  console.log(chainId, factoryAddress);

  const factoryContract = new ethers.Contract(factoryAddress, ABIs.factoryABI, provider);

  let sellAmount = 0;

  try {
    const poolAddresses = await factoryContract.getPairs(collectionAddress);
    let tokens = length;

    for (let i = 0; i < poolAddresses.length; i++) {
      const pairContract = new ethers.Contract(poolAddresses[i], ABIs.pairABI, provider);
      const _reserve0 = await pairContract.reserve0();
      const _reserve1 = await pairContract.reserve1();

      const reserve0 = Number(_reserve0);
      const reserve1 = Number(_reserve1);

      const amountOut = reserve1 * 0.7;
      
      const poolMax = (amountOut * reserve0) / (reserve1 - amountOut);
      const maxNFTs = Math.floor(poolMax);

      if (maxNFTs <= 0) {
        continue;
      }

      if (maxNFTs >= length) {
        const amountOut = ((reserve1 * length) / (reserve0 + length));
        sellAmount = sellAmount + amountOut;
      } else {
        tokens = tokens - maxNFTs;
        const amountOut = ((reserve1 * maxNFTs) / (reserve0 + maxNFTs));
        sellAmount = sellAmount + amountOut;
      }
    }

    return roundDownToTwoDecimals(Number(ethers.formatEther(BigInt(sellAmount))));
  } catch (error) {
    console.log(error);
  }
}

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
  const shiftedNumber = Math.ceil(number * 100);
  const roundedNumber = shiftedNumber / 100;
  return roundedNumber;
}

startServer();