"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { ZkLoginSession, loadZkLoginSession, clearZkLoginSession, zkExecuteTransaction } from "@/lib/zklogin";

interface ZkLoginContextType {
  session: ZkLoginSession | null;
  setSession: (s: ZkLoginSession | null) => void;
  logout: () => void;
  execute: (tx: Transaction) => Promise<unknown>;
}

const ZkLoginContext = createContext<ZkLoginContextType>({
  session: null,
  setSession: () => {},
  logout: () => {},
  execute: async () => {},
});

export function ZkLoginProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<ZkLoginSession | null>(null);
  const suiClient = useSuiClient();

  useEffect(() => {
    setSessionState(loadZkLoginSession());
  }, []);

  function setSession(s: ZkLoginSession | null) {
    setSessionState(s);
  }

  function logout() {
    clearZkLoginSession();
    setSessionState(null);
  }

  async function execute(tx: Transaction) {
    if (!session) throw new Error("No zkLogin session");
    return zkExecuteTransaction(tx, session, suiClient);
  }

  return (
    <ZkLoginContext.Provider value={{ session, setSession, logout, execute }}>
      {children}
    </ZkLoginContext.Provider>
  );
}

export function useZkLogin() {
  return useContext(ZkLoginContext);
}
