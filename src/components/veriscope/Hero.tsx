import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* restrained accent particles: 3 max, slow drift, low opacity */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="drift-slow absolute left-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-gold/25" />
        <span
          className="drift-slow absolute right-[14%] top-[38%] h-1 w-1 rounded-full bg-gold/20"
          style={{ animationDelay: "-8s" }}
        />
        <span
          className="drift-slow absolute left-[62%] bottom-[16%] h-1 w-1 rounded-full bg-gold/15"
          style={{ animationDelay: "-16s" }}
        />
        <div className="absolute left-1/2 top-0 h-[420px] w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-[110px]" />
      </div>

      <div className="section-shell relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h1 className="display-xl text-balance">
            For years, traders searched for one more indicator.{" "}
            <span className="text-muted-foreground">We asked a different question.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            What if the real problem was never a lack of information — but knowing exactly where to
            focus?
          </p>
          <div className="mt-9 flex justify-center">
            <a
              href="#what-we-built"
              className="cta-gold inline-flex items-center justify-center px-7 py-3 text-sm"
            >
              See What We Built
            </a>
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-4xl">
          <ChartMockup />
        </Reveal>
      </div>
    </section>
  );
}

function ChartMockup() {
  return (
    <div className="panel relative overflow-hidden p-3 sm:p-4">
      <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="ml-2 font-mono text-[10px] tracking-widest text-muted-foreground">
          SESSION VIEW
        </span>
      </div>
      <div className="relative overflow-hidden rounded-md bg-background/80">
        <svg
          viewBox="0 0 800 320"
          className="h-[190px] w-full sm:h-[300px]"
          role="img"
          aria-label="Abstract decorative candlestick pattern with one softly highlighted time window"
        >
          <defs>
            <linearGradient id="zone" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.775 0.12 87.5)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="oklch(0.775 0.12 87.5)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[60, 120, 180, 240].map((y) => (
            <line
              key={y}
              x1="0"
              x2="800"
              y1={y}
              y2={y}
              stroke="oklch(0.28 0 0)"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
          ))}
          <rect x="430" y="0" width="180" height="320" fill="url(#zone)" />
          <line
            x1="430"
            x2="430"
            y1="0"
            y2="320"
            stroke="oklch(0.775 0.12 87.5)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <line
            x1="610"
            x2="610"
            y1="0"
            y2="320"
            stroke="oklch(0.775 0.12 87.5)"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {Array.from({ length: 46 }).map((_, i) => {
            const x = 20 + i * 17;
            const seed = Math.round(Math.sin(i * 1.7) * 40 + Math.cos(i * 0.6) * 26);
            const mid = 170 - seed;
            const h = Math.round(12 + Math.abs(Math.sin(i * 2.3)) * 34);
            const up = Math.sin(i * 1.1) > 0;
            const color = up ? "oklch(0.78 0.17 152)" : "oklch(0.52 0.18 27)";
            return (
              <g key={i} opacity="0.85">
                <line
                  x1={x + 4}
                  x2={x + 4}
                  y1={mid - h / 2 - 9}
                  y2={mid + h / 2 + 9}
                  stroke={color}
                  strokeWidth="1"
                />
                <rect x={x} y={mid - h / 2} width="9" height={h} fill={color} rx="1" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
