"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useApproveIssuer } from "@trustify/web3";
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
import { EXPLORER_URL } from "../../lib/constants";
import { SECTOR_OPTIONS } from "@trustify/config";

const approveSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  sector: z.string().min(1, "Sector is required"),
});

type ApproveFormData = z.infer<typeof approveSchema>;

export function ApproveIssuerForm() {
  const { approveIssuer, isPending, isSuccess, isError, txHash } = useApproveIssuer();
  
  const form = useForm<ApproveFormData>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      wallet: "",
      name: "",
      sector: "Education", // Default to string label for AccessControl
    }
  });

  const onSubmit = async (data: ApproveFormData) => {
    // Note: AccessControl expects a STRING for sector (e.g. "Education")
    // Registry expects an ENUM index (e.g. 0)
    await approveIssuer(data.wallet as `0x${string}`, data.name, data.sector);
    form.reset({ wallet: "", name: "", sector: data.sector });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="wallet" className="text-slate-300">Wallet Address</Label>
        <Input
          {...form.register("wallet")}
          placeholder="0x..."
          disabled={isPending}
          className={`bg-slate-800/50 border-slate-700 text-slate-100 ${form.formState.errors.wallet ? "border-red-500" : ""}`}
        />
        {form.formState.errors.wallet && <p className="text-xs text-red-400">{form.formState.errors.wallet.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">Organization Name</Label>
        <Input
          {...form.register("name")}
          placeholder="e.g. Stanford University"
          disabled={isPending}
          className={`bg-slate-800/50 border-slate-700 text-slate-100 ${form.formState.errors.name ? "border-red-500" : ""}`}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Primary Sector</Label>
        <Select 
          value={form.watch("sector")} 
          onValueChange={(val) => form.setValue("sector", val || "Education")}
          disabled={isPending}
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
            <SelectValue placeholder="Select a sector" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
            {SECTOR_OPTIONS.map((s) => (
              <SelectItem key={s.label} value={s.label}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Confirming…" : "Approve Issuer"}
        </Button>
      </div>

      {isSuccess && txHash && (
        <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Issuer successfully approved!</p>
            <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-0.5 underline">
              View transaction <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
