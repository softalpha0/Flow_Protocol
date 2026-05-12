"use client";

import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useZkLogin } from "@/contexts/ZkLoginContext";

export function useFlowExecute() {
  const { mutate: walletExecute, isPending: walletPending } = useSignAndExecuteTransaction();
  const { session, execute: zkExecute } = useZkLogin();
  const walletAccount = useCurrentAccount();
  const [zkPending, setZkPending] = useState(false);

  const address = session?.address ?? walletAccount?.address ?? null;
  const isConnected = !!session || !!walletAccount;
  const isPending = session ? zkPending : walletPending;

  function execute(
    tx: Transaction,
    callbacks: { onSuccess: () => void; onError: (err: Error) => void }
  ) {
    if (session) {
      setZkPending(true);
      zkExecute(tx)
        .then(() => callbacks.onSuccess())
        .catch((e: unknown) => callbacks.onError(e instanceof Error ? e : new Error(String(e))))
        .finally(() => setZkPending(false));
    } else {
      walletExecute(
        { transaction: tx },
        {
          onSuccess: () => callbacks.onSuccess(),
          onError: (e: Error) => callbacks.onError(e),
        }
      );
    }
  }

  return { execute, isPending, address, isConnected };
}
