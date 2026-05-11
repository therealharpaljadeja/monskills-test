"use client";

import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { fetchCoffees, type Coffee } from "@/lib/indexer";

export function CoffeeFeed({ refreshKey }: { refreshKey: number }) {
  const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL;

  const { data, isLoading, error } = useQuery({
    queryKey: ["coffees", refreshKey],
    queryFn: () => fetchCoffees(50),
    enabled: !!indexerUrl,
    refetchInterval: 8000,
  });

  if (!indexerUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-6 text-sm text-stone-500">
        The supporters feed is powered by an Envio HyperIndex deployment. Set{" "}
        <code className="rounded bg-stone-100 px-1.5 py-0.5">
          NEXT_PUBLIC_INDEXER_URL
        </code>{" "}
        to enable it.
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Couldn&apos;t load the feed: {(error as Error).message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-white/60"
          />
        ))}
      </div>
    );
  }

  const coffees = data ?? [];
  if (coffees.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 p-6 text-center text-sm text-stone-500">
        No coffees yet. Be the first ☕
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {coffees.map((c) => (
        <CoffeeCard key={c.id} coffee={c} />
      ))}
    </ul>
  );
}

function CoffeeCard({ coffee }: { coffee: Coffee }) {
  const amount = formatEther(BigInt(coffee.amount));
  const when = new Date(Number(coffee.timestamp) * 1000);
  const name = coffee.name || "Anonymous";
  const short = `${coffee.from.slice(0, 6)}…${coffee.from.slice(-4)}`;

  return (
    <li className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-stone-900">
            {name}
            <span className="ml-2 font-mono text-xs font-normal text-stone-400">
              {short}
            </span>
          </div>
          {coffee.message && (
            <p className="mt-1 text-sm text-stone-700">{coffee.message}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-amber-700">
            ☕ {amount} MON
          </div>
          <div className="text-xs text-stone-400">
            {when.toLocaleString()}
          </div>
        </div>
      </div>
    </li>
  );
}
