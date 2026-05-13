"use client";

import { useCallback } from "react";

export function useClipboard() {
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  }, []);

  return { copy };
}
