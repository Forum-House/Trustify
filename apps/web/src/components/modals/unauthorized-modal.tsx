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
import { useRouter } from "next/navigation";

export function UnauthorizedModal({ open }: { open: boolean }) {
  const router = useRouter();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unauthorized Access</AlertDialogTitle>
          <AlertDialogDescription>
            Your wallet doesn't have permission to access this area. You need admin privileges to proceed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            If you believe you should have access, please contact an admin to request the required role.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AlertDialogCancel onClick={() => router.push("/")}>Go Home</AlertDialogCancel>
          <AlertDialogAction onClick={() => router.push("/")}>Close</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
