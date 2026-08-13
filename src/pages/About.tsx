

import HeroSection from "@/components/about/HeroSection";
import StatsSection from "@/components/about/StatsSection";
import TeamSection from "@/components/about/TeamSection";
import StoresSection from "@/components/about/StoresSection";
import CTASection from "@/components/about/CTASection";
import PillarsSection from "@/components/about/PillarSection";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout title="About Us">
      <HeroSection />
      <StatsSection />
      <PillarsSection />
      <TeamSection />
      <StoresSection />
      <CTASection />
    </Layout>
  );
};

export default About;