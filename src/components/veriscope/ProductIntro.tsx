import { Reveal } from "./Reveal";

const benefits = [
  "Better routine structure",
  "Less wasted time",
  "Less visual noise",
  "Sharper focus",
  "More structured analysis",
];

export function ProductIntro() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The first tool in the Veriscope ecosystem</p>
          <h2 className="display-md mt-4 text-balance">Veriscope Session Matrix</h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            Built to help traders identify the moments that matter, through an organized view of
            market sessions.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Reveal as="li" key={benefit} className="panel flex items-center gap-3 p-5">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
              <span className="min-w-0 text-sm text-foreground">{benefit}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyOffering() {
  return (
    <section className="py-16 sm:py-24">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
            Before you see everything Veriscope is building, we want you to experience how we think
            first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
