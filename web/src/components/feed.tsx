"use client";

import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchFeed, type GuestbookEntry } from "@/lib/feed";
import { formatTimestamp, shortAddress } from "@/lib/format";
import { INDEXER_URL } from "@/config/guestbook";

export function Feed() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["guestbook-feed"],
    queryFn: () => fetchFeed(50),
    refetchInterval: 15_000,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Guestbook history</h2>
          <p className="text-xs text-muted-foreground">
            Source: {INDEXER_URL ? "Envio indexer" : "onchain logs"}
            {isFetching ? " · refreshing…" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Refresh
        </button>
      </div>
      <ScrollArea className="h-[32rem] rounded-md border bg-card">
        <div className="flex flex-col gap-3 p-4">
          {isLoading ? (
            <FeedSkeleton />
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load feed: {(error as Error).message}
            </p>
          ) : !data || data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No signatures yet. Be the first to sign.
            </p>
          ) : (
            data.map((entry) => <FeedItem key={entry.id} entry={entry} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function FeedItem({ entry }: { entry: GuestbookEntry }) {
  return (
    <Card className="bg-background/60">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{shortAddress(entry.signer)}</span>
          <span>{formatTimestamp(entry.timestamp)}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">
          {entry.message}
        </p>
      </CardContent>
    </Card>
  );
}

function FeedSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </>
  );
}
