export const GUESTBOOK_ADDRESS = "0x593e7380E4c08F160E86b8c31e35e0C6f8885B82" as const;

export const GUESTBOOK_ABI = [
  {
    type: "function",
    name: "MAX_MESSAGE_BYTES",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "sign",
    inputs: [{ name: "message", type: "string", internalType: "string" }],
    outputs: [{ name: "id", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalEntries",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Signed",
    inputs: [
      { name: "id", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "signer", type: "address", indexed: true, internalType: "address" },
      { name: "message", type: "string", indexed: false, internalType: "string" },
      { name: "timestamp", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  { type: "error", name: "EmptyMessage", inputs: [] },
  { type: "error", name: "MessageTooLong", inputs: [] },
] as const;

export const MAX_MESSAGE_BYTES = 280;
