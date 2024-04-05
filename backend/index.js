const express = require("express");
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Add a variable for the api key, address and chain
const moralisApiKey = process.env.MORALIS_API;

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

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
          address: collections[i].id.match(/0x[a-fA-F0-9]{40}/)[0]
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


startServer();