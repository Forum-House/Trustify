import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
        <Search className="h-10 w-10" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-lg text-slate-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link 
          href="/" 
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
