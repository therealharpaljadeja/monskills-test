import { createPublicClient, http, parseAbiItem, type Address } from "viem";
import { monadTestnet } from "wagmi/chains";

import {
  GUESTBOOK_ADDRESS,
  INDEXER_URL,
} from "@/config/guestbook";

export type GuestbookEntry = {
  id: string;
  signer: Address;
  message: string;
  timestamp: bigint;
};

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http("https://testnet-rpc.monad.xyz"),
});

const MESSAGE_SIGNED_EVENT = parseAbiItem(
  "event MessageSigned(uint256 indexed id, address indexed signer, string message, uint256 timestamp)"
);

// Contract deploy block — don't scan earlier history.
const DEPLOY_BLOCK = 27045085n;

async function fetchFromIndexer(limit: number): Promise<GuestbookEntry[]> {
  const query = `
    query Feed($limit: Int!) {
      Guestbook_MessageSigned(
        limit: $limit,
        order_by: { event_id: desc }
      ) {
        id
        event_id
        signer
        message
        timestamp
      }
    }
  `;

  const res = await fetch(INDEXER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { limit } }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`indexer ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: {
      Guestbook_MessageSigned?: Array<{
        id: string;
        event_id: string;
        signer: string;
        message: string;
        timestamp: string;
      }>;
    };
    errors?: unknown;
  };

  if (json.errors || !json.data?.Guestbook_MessageSigned) {
    throw new Error("indexer query failed");
  }

  return json.data.Guestbook_MessageSigned.map((row) => ({
    id: row.event_id,
    signer: row.signer as Address,
    message: row.message,
    timestamp: BigInt(row.timestamp),
  }));
}

async function fetchFromChain(limit: number): Promise<GuestbookEntry[]> {
  const logs = await publicClient.getLogs({
    address: GUESTBOOK_ADDRESS,
    event: MESSAGE_SIGNED_EVENT,
    fromBlock: DEPLOY_BLOCK,
    toBlock: "latest",
  });

  const entries: GuestbookEntry[] = logs
    .filter((log) => log.args.id !== undefined && log.args.signer && log.args.message !== undefined && log.args.timestamp !== undefined)
    .map((log) => ({
      id: log.args.id!.toString(),
      signer: log.args.signer as Address,
      message: log.args.message as string,
      timestamp: log.args.timestamp as bigint,
    }));

  entries.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));
  return entries.slice(0, limit);
}

export async function fetchFeed(limit = 50): Promise<GuestbookEntry[]> {
  if (INDEXER_URL) {
    try {
      return await fetchFromIndexer(limit);
    } catch (err) {
      console.warn("indexer fetch failed, falling back to chain", err);
    }
  }
  return fetchFromChain(limit);
}
