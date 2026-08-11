import { Reveal } from "./Reveal";

const rows = [
  {
    label: "Focus",
    free: "Visual only",
    premium: "Feature-heavy",
    veriscope: "Attention efficiency",
  },
  {
    label: "Customization",
    free: "Minimal",
    premium: "Extensive",
    veriscope: "Focused on what matters",
  },
  {
    label: "Historical context",
    free: "Rarely included",
    premium: "Sometimes, buried in settings",
    veriscope: "Built-in session fingerprint",
  },
  {
    label: "Cost",
    free: "Free",
    premium: "Monthly subscription",
    veriscope: "Free, no card required",
  },
];

export function Differentiation() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Differentiation</p>
          <h2 className="display-md mt-4 text-balance">There are three ways to solve this.</h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison between free indicators, premium tools and the Veriscope Session Matrix
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-40 py-4 pr-4 font-medium text-muted-foreground">
                    <span className="sr-only">Criteria</span>
                  </th>
                  <th scope="col" className="py-4 pr-4 font-medium text-muted-foreground">
                    Free Indicators
                  </th>
                  <th scope="col" className="py-4 pr-4 font-medium text-muted-foreground">
                    Premium Tools
                  </th>
                  <th scope="col" className="py-4 pr-4 font-medium text-gold">
                    Veriscope Session Matrix
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border/60">
                    <th scope="row" className="py-4 pr-4 font-medium text-foreground">
                      {row.label}
                    </th>
                    <td className="py-4 pr-4 text-muted-foreground">{row.free}</td>
                    <td className="py-4 pr-4 text-muted-foreground">{row.premium}</td>
                    <td className="py-4 pr-4 text-foreground">{row.veriscope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground sm:hidden">Scroll the table sideways →</p>
        </Reveal>
      </div>
    </section>
  );
}
