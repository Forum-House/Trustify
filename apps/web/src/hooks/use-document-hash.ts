"use client";

import { useState, useCallback } from "react";

export async function computeDocumentHash(file: File): Promise<`0x${string}`> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hashHex}`;
}

export function useDocumentHash() {
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hashFile = useCallback(async (file: File) => {
    setIsHashing(true);
    setError(null);
    try {
      const computed = await computeDocumentHash(file);
      setHash(computed);
      return computed;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to hash document";
      setError(message);
      return null;
    } finally {
      setIsHashing(false);
    }
  }, []);

  return {
    hash,
    isHashing,
    error,
    hashFile,
  };
}
