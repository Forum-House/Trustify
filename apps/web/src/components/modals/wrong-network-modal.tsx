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
import { useAccount, useSwitchChain } from "wagmi";
import { resolveChainConfig } from "@/lib/wagmi";

export function WrongNetworkModal({ open }: { open: boolean }) {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const target = resolveChainConfig();

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: target.chainId });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Wrong Network</AlertDialogTitle>
          <AlertDialogDescription>
            You're currently on chain ID {chainId}, but Trustify is configured for <strong>{target.key}</strong> (chain ID {target.chainId}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Please switch your wallet to the correct network to continue.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSwitchNetwork}>
            Switch Network
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
