import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SignForm } from "@/components/sign-form";
import { Feed } from "@/components/feed";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Monad Guestbook
          </h1>
          <p className="text-sm text-neutral-400">
            Leave a permanent, onchain note on Monad testnet.
          </p>
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </header>

      <SignForm />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Historical feed
        </h2>
        <Feed />
      </section>

      <footer className="mt-6 border-t border-neutral-900 pt-4 text-xs text-neutral-600">
        Contract{" "}
        <a
          className="underline hover:text-neutral-400"
          href="https://testnet.monadscan.com/address/0x593e7380E4c08F160E86b8c31e35e0C6f8885B82"
          target="_blank"
          rel="noreferrer"
        >
          0x593e…5B82
        </a>{" "}
        · deployed via Safe multisig.
      </footer>
    </main>
  );
}
