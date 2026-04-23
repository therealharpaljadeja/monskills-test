"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { monadTestnet } from "wagmi/chains";
import { GUESTBOOK_ABI, GUESTBOOK_ADDRESS, MAX_MESSAGE_BYTES } from "@/lib/contract";

type Status =
  | { kind: "idle" }
  | { kind: "signing" }
  | { kind: "error"; message: string }
  | { kind: "success"; txHash: `0x${string}` };

export function SignForm() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const byteLen = new TextEncoder().encode(message).length;
  const disabled =
    !isConnected ||
    status.kind === "signing" ||
    byteLen === 0 ||
    byteLen > MAX_MESSAGE_BYTES;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "signing" });
    try {
      if (chainId !== monadTestnet.id) {
        await switchChainAsync({ chainId: monadTestnet.id });
      }
      const hash = await writeContractAsync({
        abi: GUESTBOOK_ABI,
        address: GUESTBOOK_ADDRESS,
        functionName: "sign",
        args: [message],
        chainId: monadTestnet.id,
      });
      setStatus({ kind: "success", txHash: hash });
      setMessage("");
      // Give the indexer a moment to pick it up, then refetch the feed.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }, 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Transaction failed";
      setStatus({ kind: "error", message: msg.split("\n")[0] });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur"
    >
      <label htmlFor="gb-message" className="block text-sm text-neutral-400 mb-2">
        Leave a message
      </label>
      <textarea
        id="gb-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isConnected ? "gm monad..." : "Connect your wallet to sign"}
        disabled={!isConnected || status.kind === "signing"}
        rows={3}
        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600 disabled:opacity-50"
      />
      <div className="mt-2 flex items-center justify-between text-xs">
        <span
          className={
            byteLen > MAX_MESSAGE_BYTES ? "text-red-400" : "text-neutral-500"
          }
        >
          {byteLen} / {MAX_MESSAGE_BYTES} bytes
        </span>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400"
        >
          {status.kind === "signing" ? "Signing…" : "Sign"}
        </button>
      </div>

      {status.kind === "error" && (
        <p className="mt-3 text-xs text-red-400">{status.message}</p>
      )}
      {status.kind === "success" && (
        <p className="mt-3 text-xs text-emerald-400">
          Signed! tx{" "}
          <a
            className="underline"
            href={`https://testnet.monadscan.com/tx/${status.txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {status.txHash.slice(0, 10)}…{status.txHash.slice(-6)}
          </a>
        </p>
      )}
      {!isConnected && (
        <p className="mt-3 text-xs text-neutral-500">
          Connect a wallet above to sign. Connected as {address ?? "—"}.
        </p>
      )}
    </form>
  );
}
