import { gql, GraphQLClient } from "graphql-request";

const endpoint =
  process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:8080/v1/graphql";

export const indexerClient = new GraphQLClient(endpoint);

export const FEED_QUERY = gql`
  query Feed($limit: Int!, $beforeEntryId: numeric) {
    GuestbookEntry(
      limit: $limit
      order_by: { entryId: desc }
      where: {
        _and: [
          { entryId: { _lt: $beforeEntryId } }
        ]
      }
    ) {
      id
      entryId
      signer
      message
      timestamp
      blockNumber
      txHash
    }
  }
`;

export const FEED_QUERY_FIRST = gql`
  query FeedFirst($limit: Int!) {
    GuestbookEntry(limit: $limit, order_by: { entryId: desc }) {
      id
      entryId
      signer
      message
      timestamp
      blockNumber
      txHash
    }
  }
`;

export type FeedEntry = {
  id: string;
  entryId: string;
  signer: string;
  message: string;
  timestamp: string;
  blockNumber: string;
  txHash: string;
};

export type FeedResponse = { GuestbookEntry: FeedEntry[] };
