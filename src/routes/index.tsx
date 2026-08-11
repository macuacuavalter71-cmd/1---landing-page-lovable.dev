import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/veriscope/SiteHeader";
import { Hero } from "@/components/veriscope/Hero";
import { Connection } from "@/components/veriscope/Connection";
import { Identification, ProblemStatement } from "@/components/veriscope/Identification";
import { ProductIntro, WhyOffering } from "@/components/veriscope/ProductIntro";
import { Differentiation } from "@/components/veriscope/Differentiation";
import { DemoCarousel } from "@/components/veriscope/DemoCarousel";
import { CommunityFeedback } from "@/components/veriscope/CommunityFeedback";
import { Faq } from "@/components/veriscope/Faq";
import { FinalCta } from "@/components/veriscope/FinalCta";

const title = "Veriscope Session Matrix — Attention-first TradingView timing";
const description =
  "A free TradingView indicator that scores how much attention the current market session deserves. No signals, no card, no account.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Connection />
        <Identification />
        <ProblemStatement />
        <ProductIntro />
        <Differentiation />
        <WhyOffering />
        <DemoCarousel />
        <CommunityFeedback />
        <Faq />
        <FinalCta />
      </main>
      <footer className="border-t border-border/60 py-10">
        <p className="section-shell text-center text-xs text-muted-foreground">
          Veriscope — tools for traders who already read charts.
        </p>
      </footer>
    </div>
  );
}
