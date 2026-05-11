import { GraphQLClient, gql } from "graphql-request";

export type Coffee = {
  id: string;
  event_id: string;
  from: string;
  amount: string;
  name: string;
  message: string;
  timestamp: string;
};

export const COFFEE_FEED_QUERY = gql`
  query CoffeeFeed($limit: Int!) {
    BuyMeACoffee_CoffeeBought(
      limit: $limit
      order_by: { event_id: desc }
    ) {
      id
      event_id
      from
      amount
      name
      message
      timestamp
    }
  }
`;

export function getIndexerClient(): GraphQLClient | null {
  const url = process.env.NEXT_PUBLIC_INDEXER_URL;
  if (!url) return null;
  return new GraphQLClient(url);
}

export async function fetchCoffees(limit = 50): Promise<Coffee[]> {
  const client = getIndexerClient();
  if (!client) return [];
  const data = await client.request<{ BuyMeACoffee_CoffeeBought: Coffee[] }>(
    COFFEE_FEED_QUERY,
    { limit }
  );
  return data.BuyMeACoffee_CoffeeBought;
}
