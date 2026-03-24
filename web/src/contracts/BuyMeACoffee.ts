export const COFFEE_CONTRACT_ADDRESS =
  "0x4CB21C74aFB88a52635dfDa52a72EB185F5CfE07" as `0x${string}`;

export const COFFEE_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buyCoffee",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_message", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getMemos",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct BuyMeACoffee.Memo[]",
        components: [
          { name: "from", type: "address", internalType: "address" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
          { name: "name", type: "string", internalType: "string" },
          { name: "message", type: "string", internalType: "string" },
          { name: "amount", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalMemos",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address payable" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawTips",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "NewMemo",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      { name: "name", type: "string", indexed: false, internalType: "string" },
      {
        name: "message",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;
