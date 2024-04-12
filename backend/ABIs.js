export const ABIs = {
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
          }
        ],
        "name": "getBuyPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "newReserve0",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "newReserve1",
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
          }
        ],
        "name": "getSellAmount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "newReserve0",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "newReserve1",
            "type": "uint256"
          }
        ],
        "stateMutability": "pure",
        "type": "function"
      }
    ]
}


