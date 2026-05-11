"use client";

import { formatEther } from "viem";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContractSync,
} from "wagmi";
import { buyMeACoffeeAbi, CONTRACT_ADDRESS, OWNER_ADDRESS } from "@/lib/contract";

export function OwnerPanel() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: CONTRACT_ADDRESS });
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: buyMeACoffeeAbi,
    functionName: "owner",
  });

  const { writeContractSync, data: receipt, isPending, error } =
    useWriteContractSync();
  const isSuccess = receipt?.status === "success";

  const currentOwner = (owner ?? OWNER_ADDRESS) as `0x${string}` | undefined;
  const isOwner =
    address && currentOwner && address.toLowerCase() === currentOwner.toLowerCase();

  if (!isOwner) return null;

  const total = balance ? formatEther(balance.value) : "0";

  function withdraw() {
    writeContractSync({
      address: CONTRACT_ADDRESS,
      abi: buyMeACoffeeAbi,
      functionName: "withdraw",
      args: [],
    });
  }

  return (
    <div className="rounded-2xl border border-stone-900 bg-stone-900 p-5 text-amber-50">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-amber-200/80">
            Owner panel
          </p>
          <p className="mt-1 text-2xl font-bold">
            {total} <span className="text-base font-medium">MON</span>
          </p>
          <p className="text-xs text-amber-100/70">Available to withdraw</p>
        </div>
        <button
          onClick={withdraw}
          disabled={isPending || !balance || balance.value === 0n}
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
        >
          {isPending ? "Sending…" : "Withdraw"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-300">{error.message.split("\n")[0]}</p>
      )}
      {isSuccess && (
        <p className="mt-2 text-xs text-green-300">Withdraw confirmed.</p>
      )}
    </div>
  );
}
