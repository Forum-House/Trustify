"use client";

import { useConnect, useAccount } from "wagmi";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Wallet, Smartphone, Loader2 } from "lucide-react";

export function ConnectWalletButton() {
  const { isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();

  if (isConnected) return null;

  return (
    <Dialog>
      <DialogTrigger 
        render={
          <Button 
            className="bg-linear-to-br from-sky-600 to-slate-900 hover:from-sky-500 hover:to-slate-800 border-slate-700 font-bold shadow-lg shadow-sky-900/20"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">Choose a Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="flex items-center justify-between gap-4 py-6 border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 text-slate-200 transition-all group"
              onClick={() => connect({ connector })}
              disabled={isPending}
            >
              <div className="flex items-center gap-3">
                {connector.name.toLowerCase().includes("walletconnect") ? (
                  <Smartphone className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Wallet className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold text-base">{connector.name}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                {connector.name.toLowerCase().includes("walletconnect") ? "Mobile / QR" : "Browser"}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
