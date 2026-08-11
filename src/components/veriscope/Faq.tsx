import { useState } from "react";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "What is the Veriscope Session Matrix?",
    a: "A free TradingView indicator that scores how much attention the current market session deserves, based on live conditions and historical session behavior.",
  },
  {
    q: "Is it a signal-generating indicator?",
    a: "No. It never draws buy/sell arrows or predicts direction — it's a timing and attention layer, not a signal generator.",
  },
  {
    q: "Does it give BUY/SELL entries?",
    a: "No, and it never will. It tells you when to look, not what to do.",
  },
  {
    q: "Do I need experience to use it?",
    a: "Some. It organizes context for traders who already read charts — it doesn't teach the basics.",
  },
  {
    q: "Does it work on every market?",
    a: "Yes — it tracks session time windows, not asset-specific patterns, so it works on any TradingView symbol.",
  },
  {
    q: "Do I need other indicators alongside it?",
    a: "No, it works standalone, though it's built to complement whatever you already use.",
  },
  {
    q: "How do I get access?",
    a: "Through the button below — free, no card, no account required.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No. It's free, permanently.",
  },
  {
    q: "Does it repaint?",
    a: "No. Session stats only lock in after a session closes, and the one external reference uses a lookahead-safe call.",
  },
  {
    q: "What's the difference from free indicators?",
    a: "Most free indicators only draw session boxes. This adds a live Attention Index, a historical session fingerprint, and DST-aware kill-zone tracking — and stays just as free.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Questions</p>
          <h2 className="display-md mt-4">Frequently asked</h2>
        </Reveal>

        <Reveal className="mt-10 divide-y divide-border/60 border-y border-border/60">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  >
                    <span className="min-w-0 text-sm text-foreground sm:text-base">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={`mt-1 shrink-0 text-gold transition-transform ${isOpen ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <p
                    id={`faq-panel-${index}`}
                    className="pb-6 pr-6 text-sm leading-relaxed text-muted-foreground"
                  >
                    {faq.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
