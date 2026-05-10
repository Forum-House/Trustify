"use client";

import { useState } from "react";
import { useRegisterDocument, useVerifyDocument } from "@trustify/web3";
import { computeDocumentHash } from "../../hooks/use-document-hash";
import { uploadFileToIpfs } from "../../lib/pinata";

export default function DemoPage() {
  const { registerDocument, isLoading: isRegistering, error: registerError } = useRegisterDocument();
  const { verifyDocument, isLoading: isVerifying, error: verifyError } = useVerifyDocument();
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>("");
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  const [verifyResult, setVerifyResult] = useState<string>("");

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 45%, #0b1020 100%)",
        color: "#e5e7eb",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          background: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(148, 163, 184, 0.3)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
      <h1 style={{ marginTop: 0, color: "#93c5fd" }}>Trustify Demo Integration</h1>
      <p style={{ marginTop: 0, color: "#cbd5e1" }}>
        Minimal vertical slice: File → IPFS → registerDocument → verifyDocument
      </p>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ marginBottom: 12 }}
      />
      <button
        disabled={!file}
        style={{ background: "#2563eb", color: "white", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
        onClick={async () => {
          if (!file) return;
          const h = await computeDocumentHash(file);
          setHash(h);
          const uploaded = await uploadFileToIpfs(file);
          setCid(uploaded.cid);
        }}
      >
        1) Upload To IPFS
      </button>
      <div style={{ marginTop: 12, color: "#a7f3d0" }}>CID: {cid || "-"}</div>
      <div style={{ color: "#bfdbfe", wordBreak: "break-all" }}>Hash: {hash || "-"}</div>

      <button
        disabled={!hash || !cid || isRegistering}
        style={{ marginTop: 14, background: "#16a34a", color: "white", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
        onClick={async () => {
          if (!hash) return;
          const issuedAt = BigInt(Math.floor(Date.now() / 1000));
          const result = await registerDocument({
            hash,
            cid,
            holderName: "Demo Holder",
            holderId: "DEMO-001",
            documentType: "Demo Certificate",
            sector: 0,
            issuedAt,
            expiresAt: 0n,
          });
          setTxHash(result.txHash);
        }}
      >
        2) registerDocument()
      </button>
      <div style={{ marginTop: 12, color: "#86efac", wordBreak: "break-all" }}>Tx: {txHash || "-"}</div>
      <div style={{ color: "#fca5a5" }}>{registerError}</div>

      <button
        disabled={!hash || isVerifying}
        style={{ marginTop: 14, background: "#7c3aed", color: "white", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
        onClick={async () => {
          if (!hash) return;
          const result = await verifyDocument(hash);
          setVerifyResult(
            JSON.stringify(result, (_key, value) =>
              typeof value === "bigint" ? value.toString() : value
            , 2)
          );
        }}
      >
        3) verifyDocument()
      </button>
      <div style={{ color: "#fca5a5" }}>{verifyError}</div>
      <pre
        style={{
          marginTop: 12,
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(148,163,184,0.3)",
          borderRadius: 10,
          padding: 12,
          overflowX: "auto",
          color: "#d1fae5",
        }}
      >
        {verifyResult || "-"}
      </pre>
      </div>
    </main>
  );
}
