'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchEntries, hasIndexer, type GuestBookEntry } from '@/lib/indexer'
import { fetchEntriesOnchain } from '@/lib/onchain-feed'

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function formatTime(ts: string) {
  const d = new Date(Number(ts) * 1000)
  return d.toLocaleString()
}

async function fetchFeed(): Promise<{ entries: GuestBookEntry[]; source: 'indexer' | 'onchain' }> {
  if (hasIndexer()) {
    try {
      const entries = await fetchEntries({ limit: 50 })
      return { entries, source: 'indexer' }
    } catch {
      // fall through to onchain fallback
    }
  }
  const entries = await fetchEntriesOnchain({ limit: 50 })
  return { entries, source: 'onchain' }
}

export function HistoryFeed({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['guestbook-feed', refreshKey],
    queryFn: fetchFeed,
    refetchInterval: 15_000,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          {data?.source === 'indexer'
            ? 'Live from the indexer · refreshes every 15s'
            : data?.source === 'onchain'
              ? 'Reading logs directly from Monad testnet'
              : 'Loading messages...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load feed.</p>
        ) : !data?.entries.length ? (
          <p className="text-sm text-muted-foreground">No messages yet. Be the first to sign.</p>
        ) : (
          data.entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-md border border-border p-3 space-y-1 bg-card"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{shortAddress(entry.signer)}</span>
                <span>#{entry.event_id} · {formatTime(entry.timestamp)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{entry.message}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
