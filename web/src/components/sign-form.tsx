"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useSendTransactionSync, useSwitchChain } from "wagmi";
import { encodeFunctionData } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  GUESTBOOK_ADDRESS,
  GUESTBOOK_CHAIN_ID,
  MAX_MESSAGE_LENGTH,
  guestbookAbi,
} from "@/config/guestbook";

export function SignForm() {
  const [message, setMessage] = useState("");
  const { address, chainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const {
    sendTransactionSyncAsync,
    isPending,
    error,
    reset,
  } = useSendTransactionSync();
  const queryClient = useQueryClient();

  const trimmed = message.trim();
  const tooLong = trimmed.length > MAX_MESSAGE_LENGTH;
  const canSubmit =
    isConnected && trimmed.length > 0 && !tooLong && !isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();

    if (chainId !== GUESTBOOK_CHAIN_ID) {
      await switchChainAsync({ chainId: GUESTBOOK_CHAIN_ID });
    }

    const data = encodeFunctionData({
      abi: guestbookAbi,
      functionName: "sign",
      args: [trimmed],
    });

    await sendTransactionSyncAsync({
      to: GUESTBOOK_ADDRESS,
      data,
      chainId: GUESTBOOK_CHAIN_ID,
    });

    setMessage("");
    await queryClient.invalidateQueries({ queryKey: ["guestbook-feed"] });
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          Connect a wallet to sign the guestbook.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Leave a note for the chain (up to ${MAX_MESSAGE_LENGTH} chars)…`}
        className="min-h-24 resize-none"
        maxLength={MAX_MESSAGE_LENGTH + 50}
        disabled={isPending}
      />
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Signed by <span className="font-mono">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
        </span>
        <span className={tooLong ? "text-destructive" : ""}>
          {trimmed.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!canSubmit}>
          {isPending ? "Signing…" : "Sign guestbook"}
        </Button>
        {error ? (
          <span className="text-xs text-destructive">
            {error.message.split("\n")[0]}
          </span>
        ) : null}
      </div>
    </form>
  );
}
