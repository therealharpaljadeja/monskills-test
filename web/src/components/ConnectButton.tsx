"use client";

import { useModal, useAccount } from "@getpara/react-sdk";
import { useAccount as useWagmiAccount, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { openModal } = useModal();
  const para = useAccount();
  const wagmi = useWagmiAccount();
  const { disconnect } = useDisconnect();

  const address = wagmi.address ?? para.embedded?.wallets?.[0]?.address;
  const isConnected = wagmi.isConnected || para.isConnected;

  if (isConnected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-stone-900 px-3 py-1.5 text-sm font-medium text-amber-50">
          {short}
        </span>
        <button
          onClick={() => {
            if (wagmi.isConnected) disconnect();
            else openModal();
          }}
          className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          {wagmi.isConnected ? "Disconnect" : "Account"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => openModal()}
      className="rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-700"
    >
      Connect wallet
    </button>
  );
}
