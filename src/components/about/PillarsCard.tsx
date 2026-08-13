import type { Pillar } from "@/types/about";
import { Card, CardContent } from "@/components/ui/card";

interface PillarCardProps {
  pillar: Pillar;
}

const PillarCard = ({ pillar }: PillarCardProps) => {
  return (
    <Card
      className="
      h-full
      rounded-2xl
      border-neutral-200
      shadow-none
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-[#C9A96E]
      hover:shadow-lg
      "
    >
      <CardContent className="space-y-5 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F4EE]">
          {pillar.icon}
        </div>

        <h3 className="font-serif text-2xl font-semibold text-[#2E1F14]">
          {pillar.title}
        </h3>

        <p className="leading-7 text-muted-foreground">
          {pillar.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default PillarCard;