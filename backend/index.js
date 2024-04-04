const express = require("express");
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Moralis
const Moralis = require("moralis").default;

// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

// Add a variable for the api key, address and chain
const moralisApiKey = process.env.MORALIS_API;

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require("./chainquests-firebase-adminsdk-xqkvw-70590c52d4.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'chainquests.appspot.com'
});

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

// Enable CORS for any origin
app.use(cors({
    origin: '*', // Allow requests from any origin
    credentials: true, // Include if you're using credentials (e.g., cookies, authorization headers)
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



startServer();