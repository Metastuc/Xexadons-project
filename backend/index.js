const express = require("express");
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const ethers = require('ethers');
const contractABIs = require('./ABIs')
require('dotenv').config();

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { rpcUrls } = require("./rpcURLs");
const { deploymentAddresses } = require("./deploymentAddresses");

const credentialPath = process.env.CREDPATH;
const serviceAccount = require(credentialPath);

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
    url: `https://testnet-api.rarible.org/v0.1/collections/byOwner?blockchains=&owner=ETHEREUM%3A${userAddress}`,
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
  const userAddress = req.query.userAddress;
  const nftAddress = req.query.nftAddress;

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
      if (items[i].contract.includes(nftAddress)) {
        const nft = {
          nftId: items[i].tokenId,
          name: items[i].meta.name,
          desc: items[i].description,
          image: items[i].meta.content[0].url
        }
        userCollectionNFTs.push(nft);
      }
    }
    // Return the userCollections array as the response
    res.status(200).json(userCollectionNFTs);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user collections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getProtocolCollections", async (req, res) => {
  try {
    const chain = req.query.chain;
    const factoryAddress = deploymentAddresses.factory.testnets[chain];
    const provider = new ethers.JsonRpcProvider(rpcUrls.testnets[chain]);

    var collectionAddresses = [];
    var collections = [];

    const factoryContract = new ethers.Contract(factoryAddress, contractABIs.ABIs.factoryABI, provider);
    const length = await factoryContract.getPoolCount();
    for (let i = 0; i < length; i++) {
      const pool = await factoryContract.pairPools(i);
      const poolAddress = pool[0];
      collectionAddresses.push(poolAddress);
    }

    for (let i = 0; i < collectionAddresses.length; i++) {
      const options = {
        method: 'GET',
        url: `https://testnet-api.rarible.org/v0.1/collections/ETHEREUM%3A${collectionAddresses[i]}`,
        headers: {
          accept: 'application/json',
          'X-API-KEY': raribleApiKey
        }
      };

      try {
        const _collection = await axios(options);
        const collection = {
          address: collectionAddresses[i],
          name: _collection.data.name,
          symbol: _collection.data.symbol,
          image: _collection.data.meta.content[0].url
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
  const collectionName= req.query.collectionName;
  const chain = req.query.chain;

  const factoryAddress = deploymentAddresses.factory.testnets[chain];
  const provider = new ethers.JsonRpcProvider(rpcUrls.testnets[chain]);

  var poolAddresses;
  var pools = [];
  var collectionPoolTotal;
  var collectionNFTTotal = 0;
  var NFTs = [];

  try {
    const factoryContract = new ethers.Contract(factoryAddress, contractABIs.ABIs.factoryABI, provider);
    poolAddresses = await factoryContract.getPairs(collectionAddress);

    collectionPoolTotal = poolAddresses.length;
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

      collectionNFTTotal = collectionNFTTotal + items.length;

      const pairContract = new ethers.Contract(poolAddresses[i], contractABIs.ABIs.pairABI, provider);
      const poolOwner = await pairContract.owner();
      const reserve0 = await pairContract.reserve0();
      const reserve1 = await pairContract.reserve1();

      const curveContract = new ethers.Contract(deploymentAddresses.curve.testnets[chain], contractABIs.ABIs.curveABI, provider);
      const buyPrice = await curveContract.getBuyPrice(1, reserve0, reserve1);
      const sellPrice = await curveContract.getSellAmount(1, reserve0, reserve1);

      const pool = {
        poolAddress: poolAddresses[i],
        owner: poolOwner,
        buyPrice: buyPrice[0],
        sellPrice: sellPrice[0],
        nftAmount: reserve0,
        tokenAmount: reserve1
      }

      pools.push(pool);

      for (let j = 0; j < items.length; j++) {
        const nft = {
          id: items[j].tokenId,
          name: collectionName + " " + "#" + items[j].tokenId,
          poolAddresses: poolAddresses[i],
          image: items[j].meta.content[0].url
        };

        NFTs.push(nft);
      }
    }
    const collection = {
      PoolTotal: collectionPoolTotal,
      nftTotal: collectionNFTTotal,
      pools: pools,
      NFTs: NFTs,
    }

    res.status(200).json(collection); 
  } catch (error) {
    
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

    const factoryContract = new ethers.Contract(factoryAddress, contractABIs.ABIs.factoryABI, provider);
    const userPools = await factoryContract.getUserPairss(address);
    
    var pools = [];

    for (let i = 0; i < userPools.length; i++) {
      const options = {
        method: 'GET',
        url: `https://testnet-api.rarible.org/v0.1/items/byOwnerWithOwnership?owner=ETHEREUM%3A${userPools[i]}`,
        headers: {
          accept: 'application/json',
          'X-API-KEY': raribleApiKey
        }
      };

      const response = await axios(options);
      const items = response.data.items;

      collectionNFTTotal = collectionNFTTotal + items.length;

      const pairContract = new ethers.Contract(userPools[i], contractABIs.ABIs.pairABI, provider);
      const poolOwner = await pairContract.owner();
      const reserve0 = await pairContract.reserve0();
      const reserve1 = await pairContract.reserve1();

      const curveContract = new ethers.Contract(deploymentAddresses.curve.testnets[chain], contractABIs.ABIs.curveABI, provider);
      const buyPrice = await curveContract.getBuyPrice(1, reserve0, reserve1);
      const sellPrice = await curveContract.getSellAmount(1, reserve0, reserve1);

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

app.get("/getSellRoute", async(req, res) => {
  const tokenIds = req.query.tokenIds;
  const collectionAddress = req.query.collectionAddress;
  const chain = req.query.chain;

  var paths = [];

  const factoryAddress = deploymentAddresses.factory.testnets[chain];
  const provider = new ethers.JsonRpcProvider(rpcUrls.testnets[chain]);

  const factoryContract = new ethers.Contract(factoryAddress, contractABIs.ABIs.factoryABI, provider);

  try {
    const poolAddresses = await factoryContract.getPairs(collectionAddress);
    let ids = tokenIds;

    for (let i = 0; i < poolAddresses.length; i++) {
      const pairContract = new ethers.Contract(poolAddresses[i], contractABIs.ABIs.pairABI, provider);
      const reserve0 = await pairContract.reserve0();
      const reserve1 = await pairContract.reserve1();
  
      const amountOut = reserve1 * 0.7;
     
      const tokenLength = (amountOut * reserve0) / (reserve1 - amountOut);
      const maxNFTs = Math.floor(tokenLength);

      if (maxNFTs <= 0) {
        continue;
      }
  
      if (maxNFTs >= ids.length) {
        const path = {
          poolAddress: poolAddresses[i],
          tokenNFTs: tokenIds
        }
        paths.push(path);
      } else {
        const poolNFTs = ids.slice(0, maxNFTs);
        ids = ids.slice(maxNFTs);
        const path = {
          poolAddress: poolAddresses[i],
          tokenNFTs: poolNFTs
        }
        paths.push(path);
      }
    }
  
    res.status(200).json(paths);
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

startServer();