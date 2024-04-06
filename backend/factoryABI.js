export const factoryABI = [
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
      }
]