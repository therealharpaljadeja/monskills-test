"use client";

import { useState } from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { CoffeeForm } from "@/components/CoffeeForm";
import { CoffeeFeed } from "@/components/CoffeeFeed";
import { OwnerPanel } from "@/components/OwnerPanel";
import { CONTRACT_ADDRESS } from "@/lib/contract";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Buy Me a Coffee</h1>
            <p className="text-xs text-stone-500">on Monad testnet</p>
          </div>
        </div>
        <ConnectButton />
      </header>

      <section className="rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
          Support my work with a coffee.
        </h2>
        <p className="mt-2 max-w-prose text-sm text-stone-700 sm:text-base">
          Tips are sent as MON on Monad testnet straight to a Safe multisig.
          Every supporter gets a permanent thank-you in the feed below.
        </p>
        <a
          href={`https://testnet.monadvision.com/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-mono text-xs text-stone-500 hover:text-amber-700"
        >
          {CONTRACT_ADDRESS} ↗
        </a>
      </section>

      <OwnerPanel />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-600">
            Send a tip
          </h3>
          <CoffeeForm onSent={() => setRefreshKey((k) => k + 1)} />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-600">
            Recent supporters
          </h3>
          <CoffeeFeed refreshKey={refreshKey} />
        </div>
      </section>

      <footer className="mt-auto pb-4 pt-8 text-center text-xs text-stone-400">
        Built on Monad · Powered by Para &amp; Envio HyperIndex
      </footer>
    </main>
  );
}
