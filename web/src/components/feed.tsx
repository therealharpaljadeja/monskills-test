"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  FEED_QUERY,
  FEED_QUERY_FIRST,
  type FeedEntry,
  type FeedResponse,
  indexerClient,
} from "@/lib/graphql";

const PAGE_SIZE = 25;

export function Feed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: ["feed"] as const,
      initialPageParam: null as string | null,
      queryFn: async ({ pageParam }): Promise<FeedResponse> => {
        if (pageParam === null) {
          return indexerClient.request<FeedResponse>(FEED_QUERY_FIRST, {
            limit: PAGE_SIZE,
          });
        }
        return indexerClient.request<FeedResponse>(FEED_QUERY, {
          limit: PAGE_SIZE,
          beforeEntryId: pageParam,
        });
      },
      getNextPageParam: (last: FeedResponse): string | undefined => {
        if (last.GuestbookEntry.length < PAGE_SIZE) return undefined;
        return last.GuestbookEntry[last.GuestbookEntry.length - 1].entryId;
      },
      refetchOnWindowFocus: false,
    });

  const entries: FeedEntry[] = data?.pages.flatMap((p) => p.GuestbookEntry) ?? [];

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
        Couldn&apos;t load the feed: {error.message}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm text-neutral-500">
        No signatures yet. Be the first.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((e) => (
        <EntryCard key={e.id} entry={e} />
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading…" : "Load older"}
        </button>
      )}
    </div>
  );
}

function EntryCard({ entry }: { entry: FeedEntry }) {
  const date = new Date(Number(entry.timestamp) * 1000);
  const signerShort = `${entry.signer.slice(0, 6)}…${entry.signer.slice(-4)}`;
  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
      <header className="mb-1.5 flex items-center justify-between text-xs">
        <a
          href={`https://testnet.monadscan.com/address/${entry.signer}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-400 hover:text-indigo-300"
        >
          {signerShort}
        </a>
        <a
          href={`https://testnet.monadscan.com/tx/${entry.txHash}`}
          target="_blank"
          rel="noreferrer"
          title={date.toLocaleString()}
          className="text-neutral-500 hover:text-neutral-300"
        >
          {formatDistanceToNow(date, { addSuffix: true })}
        </a>
      </header>
      <p className="whitespace-pre-wrap break-words text-sm text-neutral-100">
        {entry.message}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-600">
        #{entry.entryId}
      </p>
    </article>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/40"
        />
      ))}
    </div>
  );
}
