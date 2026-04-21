export type GuestBookEntry = {
  id: string
  signer: `0x${string}`
  message: string
  timestamp: string
  event_id: string
}

const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL

export async function fetchEntries({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
}): Promise<GuestBookEntry[]> {
  if (!INDEXER_URL) return []

  const query = `query Entries($limit: Int!, $offset: Int!) {
    GuestBook_MessageSigned(
      order_by: { event_id: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      signer
      message
      timestamp
      event_id
    }
  }`

  const res = await fetch(INDEXER_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { limit, offset } }),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Indexer error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'Indexer query failed')
  return json.data?.GuestBook_MessageSigned ?? []
}

export function hasIndexer() {
  return Boolean(INDEXER_URL)
}
