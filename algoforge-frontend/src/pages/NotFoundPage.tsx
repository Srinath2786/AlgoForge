import { Link } from "react-router-dom";
import { Compass, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 text-center">
      <div className="absolute h-[32rem] w-[32rem] rounded-full bg-forge/10 blur-[140px]" />
      <div className="relative max-w-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-forge/25 bg-forge/10 text-forge"><SearchX size={25} /></div>
        <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-forge">404 · Route not found</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">That challenge does not exist.</h1>
        <p className="mt-4 text-base leading-7 text-ink-muted">The page may have moved, or the link is incomplete. Head back to the forge and choose your next problem.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/"><Button variant="forge"><Home size={16} /> Home</Button></Link>
          <Link to="/problems"><Button variant="outline"><Compass size={16} /> Browse problems</Button></Link>
        </div>
      </div>
    </main>
  );
}
