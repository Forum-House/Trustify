export type HookLifecycleStatus =
  | "idle"
  | "pending"
  | "confirming"
  | "success"
  | "error";

export type HookLifecycle = {
  status: HookLifecycleStatus;
  error: string | null;
  isIdle: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function toLifecycle(status: HookLifecycleStatus, error: string | null): HookLifecycle {
  return {
    status,
    error,
    isIdle: status === "idle",
    isPending: status === "pending",
    isConfirming: status === "confirming",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
