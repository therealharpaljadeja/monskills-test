"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState } from "react";
import {
  COFFEE_CONTRACT_ADDRESS,
  COFFEE_ABI,
} from "@/contracts/BuyMeACoffee";

const AMOUNTS = [
  { label: "0.01 MON", value: "0.01" },
  { label: "0.05 MON", value: "0.05" },
  { label: "0.1 MON", value: "0.1" },
];

function BuyCoffeeForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("0.01");

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      address: COFFEE_CONTRACT_ADDRESS,
      abi: COFFEE_ABI,
      functionName: "buyCoffee",
      args: [name || "Anonymous", message || "Enjoy your coffee!"],
      value: parseEther(amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Your Name</label>
        <input
          type="text"
          placeholder="Anonymous"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          placeholder="Enjoy your coffee!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 resize-none"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Amount</label>
        <div className="flex gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setAmount(a.value)}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                amount === a.value
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending
          ? "Confirm in wallet..."
          : isConfirming
          ? "Confirming..."
          : `Buy Coffee (${amount} MON)`}
      </button>
      {isSuccess && (
        <p className="text-green-600 text-sm text-center">
          Coffee sent! Thank you!
        </p>
      )}
    </form>
  );
}

function WithdrawButton() {
  const { address } = useAccount();
  const { data: owner } = useReadContract({
    address: COFFEE_CONTRACT_ADDRESS,
    abi: COFFEE_ABI,
    functionName: "owner",
  });

  const { writeContract, isPending } = useWriteContract();

  if (!address || !owner || address.toLowerCase() !== owner.toLowerCase())
    return null;

  return (
    <button
      onClick={() =>
        writeContract({
          address: COFFEE_CONTRACT_ADDRESS,
          abi: COFFEE_ABI,
          functionName: "withdrawTips",
        })
      }
      disabled={isPending}
      className="py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Withdrawing..." : "Withdraw Tips"}
    </button>
  );
}

type Memo = {
  from: string;
  timestamp: bigint;
  name: string;
  message: string;
  amount: bigint;
};

function MemosFeed() {
  const { data: memos } = useReadContract({
    address: COFFEE_CONTRACT_ADDRESS,
    abi: COFFEE_ABI,
    functionName: "getMemos",
  });

  if (!memos || memos.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No coffees yet. Be the first!
      </p>
    );
  }

  const sortedMemos = [...(memos as readonly Memo[])].reverse();

  return (
    <div className="space-y-3 w-full max-w-md">
      <h2 className="text-lg font-semibold">Recent Coffees</h2>
      {sortedMemos.map((memo, i) => (
        <div
          key={i}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="font-medium text-gray-900">{memo.name}</span>
            <span className="text-sm text-purple-600 font-medium">
              {formatEther(memo.amount)} MON
            </span>
          </div>
          <p className="text-gray-600 text-sm">{memo.message}</p>
          <p className="text-gray-400 text-xs mt-2">
            {new Date(Number(memo.timestamp) * 1000).toLocaleString()} &middot;{" "}
            {memo.from.slice(0, 6)}...{memo.from.slice(-4)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Buy Me a Coffee</h1>
          <p className="text-gray-500">on Monad Testnet</p>
        </div>

        <ConnectButton />

        {isConnected && (
          <>
            <BuyCoffeeForm />
            <WithdrawButton />
            <hr className="w-full border-gray-200" />
            <MemosFeed />
          </>
        )}
      </div>
    </main>
  );
}
