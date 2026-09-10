import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-danger/20 bg-danger/10 text-danger">
        <AlertTriangle size={18} />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">Unable to load this area</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">{message}</p>
      {onRetry && <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}><RefreshCw size={14} /> Retry</Button>}
    </div>
  );
}
