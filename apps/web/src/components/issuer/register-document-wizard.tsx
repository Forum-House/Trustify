"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, Upload, FileText, Eye, Zap } from "lucide-react";
import { computeDocumentHash } from "../../hooks/use-document-hash";
import { uploadFileToIpfs } from "../../lib/pinata";
import { useRegisterDocument } from "@trustify/web3";
import { EXPLORER_URL } from "../../lib/constants";

const SECTORS = [
  { value: 0, label: "Education" },
  { value: 1, label: "Healthcare" },
  { value: 2, label: "Legal" },
  { value: 3, label: "Government" },
  { value: 4, label: "Corporate" },
];

const STEP_LABELS = ["Upload", "Metadata", "Review", "Confirm"] as const;
const STEP_ICONS = [Upload, FileText, Eye, Zap];

type Step = 0 | 1 | 2 | 3;

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEP_LABELS.map((label, idx) => {
        const Icon = STEP_ICONS[idx];
        const isActive = idx === step;
        const isDone = idx < step;
        return (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${isDone
                  ? "bg-emerald-600 text-white"
                  : isActive
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span className={`text-xs hidden sm:block ${isActive ? "text-sky-300 font-medium" : isDone ? "text-emerald-400" : "text-slate-500"}`}>
              {label}
            </span>
            {idx < STEP_LABELS.length - 1 && (
              <div className={`h-px w-4 sm:w-6 ${idx < step ? "bg-emerald-600" : "bg-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RegisterDocumentWizard() {
  const { registerDocument, isPending, isSuccess, txHash } = useRegisterDocument();

  const [step, setStep] = useState<Step>(0);

  // Step 0: Upload
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [hashing, setHashing] = useState(false);

  // Step 1: Metadata
  const [holderName, setHolderName] = useState("");
  const [holderId, setHolderId] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [sector, setSector] = useState(0);
  const [issuedAt, setIssuedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  // Step 2: Upload to IPFS
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const reset = () => {
    setStep(0);
    setFile(null);
    setHash(null);
    setHolderName("");
    setHolderId("");
    setDocumentType("");
    setSector(0);
    setIssuedAt("");
    setExpiresAt("");
    setCid("");
    setUploadError("");
  };

  // --- Step 0: File Upload ---
  if (step === 0) {
    return (
      <div className="space-y-4">
        <StepIndicator step={0} />
        <p className="text-sm text-slate-400">Select the document file to register. A SHA-256 hash will be computed client-side.</p>
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/40 cursor-pointer hover:border-sky-600 transition-colors">
          <Upload className="h-6 w-6 text-slate-500 mb-2" />
          <span className="text-sm text-slate-400">{file ? file.name : "Click to select file"}</span>
          <input
            type="file"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0] ?? null;
              if (!f) return;
              setFile(f);
              setHashing(true);
              const h = await computeDocumentHash(f);
              setHash(h);
              setHashing(false);
            }}
          />
        </label>
        {hashing && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Computing hash…
          </div>
        )}
        {hash && (
          <div className="rounded-md bg-slate-800/60 px-3 py-2">
            <p className="text-xs text-slate-500 mb-1">SHA-256 Hash</p>
            <p className="font-mono text-xs text-sky-300 break-all">{hash}</p>
          </div>
        )}
        <button
          onClick={() => setStep(1)}
          disabled={!hash || hashing}
          className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Metadata →
        </button>
      </div>
    );
  }

  // --- Step 1: Metadata ---
  if (step === 1) {
    const isValid = holderName && holderId && documentType && issuedAt;
    return (
      <div className="space-y-4">
        <StepIndicator step={1} />
        <div className="grid gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Holder Name *</label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 text-sm"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Holder ID *</label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 text-sm"
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              placeholder="ID-123456"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Document Type *</label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 text-sm"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              placeholder="Degree Certificate"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Sector *</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm"
              value={sector}
              onChange={(e) => setSector(Number(e.target.value))}
            >
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Issue Date *</label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Expiry Date</label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep(0)} className="flex-1 rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
            ← Back
          </button>
          <button
            onClick={async () => {
              if (!file) return;
              setUploading(true);
              setUploadError("");
              try {
                const result = await uploadFileToIpfs(file);
                setCid(result.cid);
                setStep(2);
              } catch (e: any) {
                setUploadError(e.message ?? "IPFS upload failed");
              } finally {
                setUploading(false);
              }
            }}
            disabled={!isValid || uploading}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? "Uploading…" : "Upload & Review →"}
          </button>
        </div>
        {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
      </div>
    );
  }

  // --- Step 2: Review ---
  if (step === 2) {
    const sectorLabel = SECTORS.find((s) => s.value === sector)?.label ?? "Education";
    return (
      <div className="space-y-4">
        <StepIndicator step={2} />
        <p className="text-sm text-slate-400">Review all details before signing the transaction.</p>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 divide-y divide-slate-700/50 text-sm">
          {[
            ["File", file?.name ?? "-"],
            ["Holder Name", holderName],
            ["Holder ID", holderId],
            ["Document Type", documentType],
            ["Sector", sectorLabel],
            ["Issue Date", issuedAt],
            ["Expiry Date", expiresAt || "None"],
            ["IPFS CID", cid],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between px-3 py-2">
              <span className="text-slate-400 flex-shrink-0 mr-4">{label}</span>
              <span className="text-slate-100 text-right break-all font-mono text-xs">{value}</span>
            </div>
          ))}
          <div className="px-3 py-2">
            <span className="text-slate-400">Hash</span>
            <p className="mt-1 font-mono text-xs text-sky-300 break-all">{hash}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep(1)} className="flex-1 rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
            ← Back
          </button>
          <button
            onClick={() => setStep(3)}
            className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Confirm & Sign →
          </button>
        </div>
      </div>
    );
  }

  // --- Step 3: Confirm / Signing ---
  return (
    <div className="space-y-4">
      <StepIndicator step={3} />
      {!isSuccess ? (
        <>
          <p className="text-sm text-slate-400">
            Your wallet will prompt you to sign the registration transaction on Polygon Amoy.
          </p>
          <button
            onClick={async () => {
              if (!hash) return;
              const issuedAtTs = BigInt(Math.floor(new Date(issuedAt).getTime() / 1000));
              const expiresAtTs = expiresAt ? BigInt(Math.floor(new Date(expiresAt).getTime() / 1000)) : 0n;
              await registerDocument({ hash, cid, holderName, holderId, documentType, sector, issuedAt: issuedAtTs, expiresAt: expiresAtTs });
            }}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
            {isPending ? "Waiting for confirmation…" : "Sign & Register on Blockchain"}
          </button>
          {!isPending && (
            <button onClick={() => setStep(2)} className="w-full rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
              ← Back to Review
            </button>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <p className="text-lg font-bold text-emerald-400">Registered Successfully!</p>
            <p className="text-sm text-slate-400 text-center">Your document is now immutably recorded on the blockchain.</p>
          </div>
          {txHash && (
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm text-sky-400 hover:text-sky-300 border border-slate-700"
            >
              View transaction on Polygonscan <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={reset}
            className="w-full rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Register another document
          </button>
        </div>
      )}
    </div>
  );
}
