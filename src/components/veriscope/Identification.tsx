import { Reveal } from "./Reveal";

const points = [
  "Hours spent staring at charts, waiting for something to happen",
  "Too many indicators competing for the same space",
  "Sessions overlapping without knowing which one actually matters right now",
  "Watching the real move happen — after it already happened",
  "Burning focus during hours that were never going to move",
];

export function Identification() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal>
          <h2 className="display-md max-w-2xl text-balance">
            If you've traded for years, you've probably felt this.
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <Reveal as="li" key={point} className="panel flex gap-3 p-5">
              <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-sm text-gold">
                ×
              </span>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{point}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProblemStatement() {
  return (
    <section className="py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="gold-rule mx-auto" />
          <p className="mt-8 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
            Most tools show you what already happened. Very few help you answer the question that
            actually matters:{" "}
            <span className="text-gold">when is it worth paying attention?</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
