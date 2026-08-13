import SectionHeading from "@/components/common/SectionHeading";
import TeamCard from "./TeamCard";

import { TEAM } from "@/pages/aboutData";

const TeamSection = () => {
  return (
    <section className="container mx-auto px-6 py-20">

      <SectionHeading
        eyebrow="Meet The Team"
        title="People Behind Every Cup"
        description="A passionate team of coffee lovers committed to delivering exceptional experiences."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {TEAM.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
          />
        ))}
      </div>

    </section>
  );
};

export default TeamSection;