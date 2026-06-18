import FeaturesSection from "@/components/FeaturedSection";
import JobsSection from "@/components/JobSection";
import StatsSection from "@/components/StateSection";
import PricingSection from "@/components/PricingSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <StatsSection></StatsSection>
      <JobsSection></JobsSection>
      <FeaturesSection></FeaturesSection>
      <PricingSection></PricingSection>
    </div>
  );
}
