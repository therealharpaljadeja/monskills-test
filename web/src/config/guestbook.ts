import { monadTestnet } from "wagmi/chains";

export const GUESTBOOK_ADDRESS =
  "0x126405eb668eBD2572f18605F2EcA66B45E1E2A3" as const;

export const GUESTBOOK_CHAIN_ID = monadTestnet.id;

export const MAX_MESSAGE_LENGTH = 280;

export const INDEXER_URL =
  process.env.NEXT_PUBLIC_INDEXER_URL ?? "";

export const guestbookAbi = [
  {
    type: "function",
    name: "sign",
    stateMutability: "nonpayable",
    inputs: [{ name: "message", type: "string" }],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalMessages",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "MAX_MESSAGE_LENGTH",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "MessageSigned",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "signer", type: "address", indexed: true },
      { name: "message", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  { type: "error", name: "MessageEmpty", inputs: [] },
  {
    type: "error",
    name: "MessageTooLong",
    inputs: [
      { name: "length", type: "uint256" },
      { name: "max", type: "uint256" },
    ],
  },
] as const;
