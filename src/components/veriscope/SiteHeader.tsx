import { Diamond } from "./Diamond";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="section-shell flex items-center justify-center gap-2 py-5">
        <Diamond className="h-4 w-4 shrink-0 text-gold" />
        <span className="font-display text-sm tracking-[0.34em] text-foreground">VERISCOPE</span>
      </div>
    </header>
  );
}
