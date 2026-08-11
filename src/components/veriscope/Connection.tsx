import { Reveal } from "./Reveal";

const paragraphs = [
  "You didn't start trading to babysit a screen full of indicators.",
  "You started because you saw what real clarity could do — clean reads, fewer second-guesses, a process you could actually trust.",
  "If that clarity has stayed just out of reach, that's not a skill problem. Most tools were built to sell you more, not to make your job simpler.",
  "You've probably suspected that for a while — that one more indicator was never going to fix it. You were right.",
  "The real fear was never missing a single trade. It's the quiet erosion of confidence that comes from never quite knowing where to look.",
];

export function Connection() {
  return (
    <section id="what-we-built" className="py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow">Why this feels different</p>
          <div className="gold-rule mt-5" />
          <div className="mt-8 space-y-6 text-[1.02rem] leading-relaxed text-muted-foreground sm:text-lg">
            {paragraphs.map((p) => (
              <p key={p} className="text-pretty">
                {p}
              </p>
            ))}
            <p className="text-pretty text-foreground">
              We didn't build Veriscope to sell you more. We built it on a different premise: your
              attention is the edge — not your indicator count.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
