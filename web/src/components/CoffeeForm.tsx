"use client";

import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContractSync } from "wagmi";
import { useModal } from "@getpara/react-sdk";
import { buyMeACoffeeAbi, CONTRACT_ADDRESS } from "@/lib/contract";

const PRESETS = ["0.1", "0.5", "1"];

export function CoffeeForm({ onSent }: { onSent?: () => void }) {
  const { openModal } = useModal();
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(PRESETS[0]);

  const { writeContractSync, data: receipt, isPending, error, reset } =
    useWriteContractSync();
  const isSuccess = receipt?.status === "success";

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setName("");
        setMessage("");
        setAmount(PRESETS[0]);
        reset();
        onSent?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset, onSent]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected) {
      openModal();
      return;
    }
    if (!amount || Number(amount) <= 0) return;
    writeContractSync({
      address: CONTRACT_ADDRESS,
      abi: buyMeACoffeeAbi,
      functionName: "buyCoffee",
      args: [name, message],
      value: parseEther(amount),
    });
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Your name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={48}
          placeholder="Anonymous"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          rows={3}
          placeholder="Loved your latest post!"
          className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Tip amount (MON)
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setAmount(p)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                amount === p
                  ? "border-amber-600 bg-amber-600 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              ☕ {p}
            </button>
          ))}
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="w-24 rounded-full border border-stone-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
      >
        {isPending
          ? "Sending…"
          : isConnected
            ? `Send ${amount || 0} MON`
            : "Connect wallet to tip"}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error.message.split("\n")[0]}</p>
      )}
      {isSuccess && (
        <p className="text-sm text-green-700">Thanks for the coffee! ☕</p>
      )}
    </form>
  );
}
