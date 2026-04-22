"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Feed } from "@/components/feed";
import { SignForm } from "@/components/sign-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUESTBOOK_ADDRESS } from "@/config/guestbook";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monad Guestbook</h1>
          <p className="text-xs text-muted-foreground">
            Onchain signatures on Monad testnet ·{" "}
            <a
              href={`https://testnet.monadvision.com/address/${GUESTBOOK_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono underline underline-offset-2"
            >
              {GUESTBOOK_ADDRESS.slice(0, 6)}…{GUESTBOOK_ADDRESS.slice(-4)}
            </a>
          </p>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign the guestbook</CardTitle>
        </CardHeader>
        <CardContent>
          <SignForm />
        </CardContent>
      </Card>

      <Feed />
    </main>
  );
}
