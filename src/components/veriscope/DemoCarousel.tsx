import { useState } from "react";
import { Reveal } from "./Reveal";
import demo1m from "@/assets/demo-1m.jpg.asset.json";
import demo2h from "@/assets/demo-2h.jpg.asset.json";
import demoMonthly from "@/assets/demo-monthly.jpg.asset.json";

type Slide = {
  id: string;
  label: string;
  /** Real TradingView screenshots supplied by the user. Never substitute a simulated chart. */
  src?: string;
  alt: string;
};

const slides: Slide[] = [
  {
    id: "1m",
    label: "1 Minute",
    src: demo1m.url,
    alt: "Veriscope Session Matrix on a 1 minute TradingView chart",
  },
  {
    id: "2h",
    label: "2 Hours",
    src: demo2h.url,
    alt: "Veriscope Session Matrix on a 2 hour TradingView chart",
  },
  {
    id: "monthly",
    label: "Monthly",
    src: demoMonthly.url,
    alt: "Veriscope Session Matrix on a monthly TradingView chart",
  },
];

export function DemoCarousel() {
  const [active, setActive] = useState(slides[0]!.id);
  const current = slides.find((slide) => slide.id === active)!;

  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Real demo</p>
          <h2 className="display-md mt-4 text-balance">This is what it looks like on your chart.</h2>
        </Reveal>

        <Reveal className="mt-10">
          <div
            role="tablist"
            aria-label="Chart timeframes"
            className="flex flex-wrap gap-2 border-b border-border pb-3"
          >
            {slides.map((slide) => (
              <button
                key={slide.id}
                role="tab"
                type="button"
                id={`demo-tab-${slide.id}`}
                aria-selected={active === slide.id}
                aria-controls={`demo-panel-${slide.id}`}
                onClick={() => setActive(slide.id)}
                className={`rounded-md px-4 py-2 text-sm transition-colors ${
                  active === slide.id
                    ? "bg-secondary text-foreground ring-1 ring-gold/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {slide.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`demo-panel-${current.id}`}
            aria-labelledby={`demo-tab-${current.id}`}
            className="panel mt-5 p-3 sm:p-4"
          >
            {current.src ? (
              <div className="-mx-1 overflow-x-auto">
                <img
                  src={current.src}
                  alt={current.alt}
                  loading="lazy"
                  className="mx-auto h-auto w-full min-w-[36rem] max-w-full object-contain sm:min-w-0"
                />
              </div>
            ) : (
              <EmptySlot label={current.label} />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center sm:min-h-[320px]">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-6 w-6 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m4 16 5-5 4 4 3-3 4 4" />
      </svg>
      <p className="text-sm text-muted-foreground">Screenshot pending upload</p>
      <p className="text-xs text-muted-foreground/70">{label} timeframe</p>
    </div>
  );
}
