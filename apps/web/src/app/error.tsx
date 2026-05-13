"use client";

import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-lg text-slate-400">
        An unexpected error occurred while rendering the page. Please try refreshing or return home.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => reset()}
          size="lg"
          className="bg-red-600 hover:bg-red-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Link 
          href="/" 
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <pre className="mt-12 max-w-2xl overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-left text-xs text-red-400">
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      )}
    </div>
  );
}
