import { GradientMesh } from "@/components/ui/gradient-mesh";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { BuiltByAgents } from "@/components/landing/BuiltByAgents";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Global animated gradient mesh */}
      <GradientMesh />

      {/* Noise texture overlay */}
      <div className="noise" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Pricing />
        <BuiltByAgents />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
