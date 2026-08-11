import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-xl text-center">
          <div className="gold-rule mx-auto" />
          <p className="mt-8 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
            Discover a more organized way to analyze market timing.
          </p>
          <div className="mt-9 flex justify-center">
            {/* TODO: replace placeholder href with the real access destination */}
            <a
              href="#next-step"
              className="cta-gold inline-flex items-center justify-center px-7 py-3 text-sm"
            >
              Continue to Access
            </a>
          </div>
          <p className="mt-10 text-sm text-muted-foreground">— Alex, Liquidity Alert</p>
        </Reveal>
      </div>
    </section>
  );
}
