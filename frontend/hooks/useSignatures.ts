"use client";

import { useState, useEffect, useCallback } from "react";

export interface SignatureRecord {
  txnId: number;
  signer: string;
  signature: string;
  timestamp: number;
}

export function useSignatures() {
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);

  // Load signatures from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("stacksfort_signatures");
    if (stored) {
      try {
        setSignatures(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored signatures", e);
      }
    }
  }, []);

  // Save signatures to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("stacksfort_signatures", JSON.stringify(signatures));
  }, [signatures]);

  const addSignature = useCallback((record: SignatureRecord) => {
    setSignatures((prev) => {
      // Prevent duplicates
      const exists = prev.some(
        (s) => s.txnId === record.txnId && s.signer === record.signer
      );
      if (exists) return prev;
      return [...prev, record];
    });
  }, []);

  const getTxnSignatures = useCallback(
    (txnId: number) => {
      return signatures.filter((s) => s.txnId === txnId);
    },
    [signatures]
  );

  const hasSigned = useCallback(
    (txnId: number, address: string) => {
      return signatures.some((s) => s.txnId === txnId && s.signer === address);
    },
    [signatures]
  );

  return {
    signatures,
    addSignature,
    getTxnSignatures,
    hasSigned,
  };
}
