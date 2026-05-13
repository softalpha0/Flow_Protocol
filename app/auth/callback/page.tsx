"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSuiClient } from "@mysten/dapp-kit";
import { completeZkLogin } from "@/lib/zklogin";
import { useZkLogin } from "@/contexts/ZkLoginContext";

export default function AuthCallback() {
  const router = useRouter();
  const suiClient = useSuiClient();
  const { setSession } = useZkLogin();
  const [status, setStatus] = useState("Processing login...");
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const jwt = params.get("id_token");

    if (!jwt) {
      setError("No token received. Please try signing in again.");
      return;
    }

    const epochStr = sessionStorage.getItem("zkl_epoch");
    const keyStr = sessionStorage.getItem("zkl_key");
    if (!epochStr || !keyStr) {
      setError("Session expired. Please go back and sign in again.");
      return;
    }

    setStatus("Generating your Sui wallet...");
    completeZkLogin(jwt, suiClient as Parameters<typeof completeZkLogin>[1])
      .then((session) => {
        setSession(session);
        setStatus("Done! Redirecting...");
        router.push("/app");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`Login failed: ${msg}`);
      });
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        {error ? (
          <div>
            <p className="text-[#EF4444] mb-4 text-sm">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-[#2563EB] hover:underline"
            >
              Go back
            </button>
          </div>
        ) : (
          <div>
            <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6B7280] text-sm">{status}</p>
            <p className="text-xs text-[#9CA3AF] mt-2">Fetching ZK proof from Mysten prover...</p>
          </div>
        )}
      </div>
    </main>
  );
}
