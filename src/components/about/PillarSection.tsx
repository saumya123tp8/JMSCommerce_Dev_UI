import SectionHeading from "@/components/common/SectionHeading";
import PillarCard from "./PillarsCard";
import { PILLARS } from "@/pages/aboutData";

const PillarsSection = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <SectionHeading eyebrow="What We Stand For" />

      <div className="grid gap-6 md:grid-cols-2">
        {PILLARS.map((pillar) => (
          <PillarCard
            key={pillar.title}
            pillar={pillar}
          />
        ))}
      </div>
    </section>
  );
};

export default PillarsSection;