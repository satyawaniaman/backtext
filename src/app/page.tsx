import Features from "@/components/features";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Pricing from "@/components/pricing";

export default function HomePage() {
  return (
    <div className="bg-slate-50">
      <HeroSection />
      <Features />
      <Pricing />
      <FooterSection />
    </div>
  );
}
