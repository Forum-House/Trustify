"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, ExternalLink, Loader2, Upload, FileText, Eye, Zap, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { computeDocumentHash } from "../../hooks/use-document-hash";
import { uploadFileToIpfs } from "../../lib/pinata";
import { useRegisterDocument } from "@trustify/web3";
import { EXPLORER_URL } from "../../lib/constants";
import { SECTOR_OPTIONS } from "@trustify/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// --- Schema Definitions ---
const registerSchema = z.object({
  holderName: z.string().min(2, "Name must be at least 2 characters"),
  holderId: z.string().min(1, "Holder ID is required"),
  documentType: z.string().min(1, "Document type is required"),
  sector: z.string().min(1, "Sector is required"),
  issuedAt: z.string().min(1, "Issue date is required"),
  expiresAt: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const STEP_LABELS = ["Upload", "Metadata", "Review", "Confirm"] as const;
const STEP_ICONS = [Upload, FileText, Eye, Zap];

type Step = 0 | 1 | 2 | 3;

// --- Components ---
function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      {STEP_LABELS.map((label, idx) => {
        const Icon = STEP_ICONS[idx];
        const isActive = idx === step;
        const isDone = idx < step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2 relative">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isActive
                      ? "bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-500/20"
                      : "bg-slate-900 border-slate-700 text-slate-500"
                  }`}
              >
                {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium absolute -bottom-6 whitespace-nowrap transition-colors ${isActive ? "text-sky-300" : isDone ? "text-emerald-400" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 transition-colors duration-500 ${idx < step ? "bg-emerald-600" : "bg-slate-700"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RegisterDocumentWizard() {
  const { registerDocument, isPending, isSuccess, txHash, isError } = useRegisterDocument();
  
  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [hashing, setHashing] = useState(false);
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      holderName: "",
      holderId: "",
      documentType: "",
      sector: "0",
      issuedAt: "",
      expiresAt: "",
    }
  });

  const reset = () => {
    setStep(0);
    setFile(null);
    setHash(null);
    setCid("");
    setUploadError("");
    form.reset();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setFile(f);
    setHashing(true);
    try {
      const h = await computeDocumentHash(f);
      setHash(h);
    } catch (err) {
      console.error(err);
    } finally {
      setHashing(false);
    }
  };

  const onMetadataSubmit = async (data: RegisterFormData) => {
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
  };

  // --- Step 0: File Upload ---
  if (step === 0) {
    return (
      <div className="space-y-6 pt-2">
        <StepIndicator step={0} />
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-100">Upload Document</h2>
            <p className="text-sm text-slate-400 mt-1">We'll compute a cryptographic hash of your file locally.</p>
          </div>
          
          <label className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            hash 
              ? "bg-sky-500/5 border-sky-500/30" 
              : "bg-slate-800/40 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800/60"
          }`}>
            {!hashing && !hash && (
              <div className="flex flex-col items-center p-6">
                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-300">Select file to register</p>
                <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or Image (max 5MB)</p>
              </div>
            )}
            
            {hashing && (
              <div className="flex flex-col items-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-2" />
                <p className="text-sm text-slate-300">Computing local hash…</p>
              </div>
            )}
            
            {hash && !hashing && (
              <div className="flex flex-col items-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-emerald-400">{file?.name}</p>
                <div className="mt-4 px-3 py-1.5 rounded bg-slate-900 border border-slate-700 max-w-full">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">SHA-256 Hash</p>
                  <p className="font-mono text-[10px] text-sky-300 break-all">{hash}</p>
                </div>
                <Button variant="ghost" size="sm" className="mt-3 text-slate-500 hover:text-slate-300" onClick={(e) => {
                  e.preventDefault();
                  setHash(null);
                  setFile(null);
                }}>Change file</Button>
              </div>
            )}
            
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          <Button
            onClick={() => setStep(1)}
            disabled={!hash || hashing}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white h-11"
          >
            Next: Metadata <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // --- Step 1: Metadata ---
  if (step === 1) {
    return (
      <div className="space-y-6 pt-2">
        <StepIndicator step={1} />
        <form onSubmit={form.handleSubmit(onMetadataSubmit)} className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-slate-100">Document Metadata</h2>
            <p className="text-sm text-slate-400 mt-1">Provide details about the credential being issued.</p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="holderName" className="text-slate-300">Holder Name <span className="text-sky-500">*</span></Label>
              <Input
                {...form.register("holderName")}
                placeholder="e.g. John Doe"
                className={`bg-slate-800/50 border-slate-700 ${form.formState.errors.holderName ? "border-red-500" : ""}`}
              />
              {form.formState.errors.holderName && <p className="text-xs text-red-400">{form.formState.errors.holderName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="holderId" className="text-slate-300">Holder ID / Roll No <span className="text-sky-500">*</span></Label>
                <Input
                  {...form.register("holderId")}
                  placeholder="e.g. ID-12345"
                  className={`bg-slate-800/50 border-slate-700 ${form.formState.errors.holderId ? "border-red-500" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="docType" className="text-slate-300">Document Type <span className="text-sky-500">*</span></Label>
                <Input
                  {...form.register("documentType")}
                  placeholder="e.g. Degree Certificate"
                  className={`bg-slate-800/50 border-slate-700 ${form.formState.errors.documentType ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Sector <span className="text-sky-500">*</span></Label>
              <Select value={form.watch("sector")} onValueChange={(val) => form.setValue("sector", val || "0")}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {SECTOR_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuedAt" className="text-slate-300">Issue Date <span className="text-sky-500">*</span></Label>
                <Input
                  {...form.register("issuedAt")}
                  type="date"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="text-slate-300">Expiry Date</Label>
                <Input
                  {...form.register("expiresAt")}
                  type="date"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setStep(0)} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || uploading}
              className="flex-[2] bg-sky-600 hover:bg-sky-500 text-white"
            >
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {uploading ? "Uploading to IPFS…" : "Upload & Review"}
            </Button>
          </div>
          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
              <AlertCircle className="h-3 w-3" /> {uploadError}
            </div>
          )}
        </form>
      </div>
    );
  }

  // --- Step 2: Review ---
  if (step === 2) {
    const formData = form.getValues();
    const sectorLabel = SECTOR_OPTIONS.find((s) => s.value === formData.sector)?.label ?? "Education";
    return (
      <div className="space-y-6 pt-2">
        <StepIndicator step={2} />
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-100">Review Registration</h2>
            <p className="text-sm text-slate-400 mt-1">Ensure all details are correct before committing to blockchain.</p>
          </div>

          <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
            <div className="divide-y divide-slate-700/50">
              {[
                { label: "Holder Name", value: formData.holderName },
                { label: "Holder ID", value: formData.holderId },
                { label: "Document Type", value: formData.documentType },
                { label: "Sector", value: sectorLabel },
                { label: "Issue Date", value: formData.issuedAt },
                { label: "Expiry Date", value: formData.expiresAt || "No Expiry", isDim: !formData.expiresAt },
                { label: "IPFS CID", value: cid, isMono: true },
                { label: "File Hash", value: hash, isMono: true, isSpecial: true },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between px-4 py-3 gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className={`text-sm break-all ${
                    item.isSpecial ? "text-sky-400 font-mono text-xs" : 
                    item.isMono ? "text-slate-300 font-mono text-xs" : 
                    item.isDim ? "text-slate-500 italic" : "text-slate-100 font-medium"
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-slate-700 text-slate-300">
              <ChevronLeft className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Sign & Register <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Step 3: Confirm ---
  return (
    <div className="space-y-6 pt-2">
      <StepIndicator step={3} />
      {!isSuccess ? (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="h-16 w-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-sky-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Ready to Sign</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
              Your wallet will prompt you to authorize the transaction on Polygon Amoy.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={async () => {
                if (!hash) return;
                const data = form.getValues();
                const issuedAtTs = BigInt(Math.floor(new Date(data.issuedAt).getTime() / 1000));
                const expiresAtTs = data.expiresAt ? BigInt(Math.floor(new Date(data.expiresAt).getTime() / 1000)) : 0n;
                await registerDocument({ 
                  hash, 
                  cid, 
                  holderName: data.holderName, 
                  holderId: data.holderId, 
                  documentType: data.documentType, 
                  sector: Number(data.sector), 
                  issuedAt: issuedAtTs, 
                  expiresAt: expiresAtTs 
                });
              }}
              disabled={isPending}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold shadow-lg shadow-emerald-500/20"
            >
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
              {isPending ? "Waiting for Wallet…" : "Confirm Registration"}
            </Button>
            
            {!isPending && (
              <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-slate-500 hover:text-slate-300">
                Cancel and Review
              </Button>
            )}
          </div>

          {isError && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>The transaction was rejected or failed. Please check your wallet and try again.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-400">Registration Complete!</h2>
              <p className="text-slate-400 mt-2 max-w-sm">
                The document hash and metadata are now permanently stored on the Polygon blockchain.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {txHash && (
              <Button variant="outline" className="w-full h-11 border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-sky-400 p-0">
                <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center">
                  View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button onClick={reset} className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-white">
              Issue Another Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
