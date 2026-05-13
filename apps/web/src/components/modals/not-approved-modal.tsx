"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";

export function NotApprovedModal({ open }: { open: boolean }) {
  const router = useRouter();
  const { disconnect } = useDisconnect();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Issuer Approval Pending</AlertDialogTitle>
          <AlertDialogDescription>
            Your wallet is connected, but it doesn't have issuer permissions yet. Once an admin approves your wallet, you'll be able to access issuer features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            You can still verify documents on the public verification page while waiting for approval.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AlertDialogCancel onClick={() => disconnect()}>Disconnect Wallet</AlertDialogCancel>
          <AlertDialogAction onClick={() => router.push("/")}>Go Home</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
