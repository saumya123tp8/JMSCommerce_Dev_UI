import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import type { TeamMember } from "@/types/about";

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard = ({ member }: TeamCardProps) => {
  return (
    <Card
      className="
      border-neutral-200
      shadow-none
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
      "
    >
      <CardContent className="flex flex-col items-center p-8 text-center">
        <Avatar className="h-16 w-16 bg-[#2E1F14]">
          <AvatarFallback className="bg-[#2E1F14] text-lg font-semibold text-[#C9A96E]">
            {member.initials}
          </AvatarFallback>
        </Avatar>

        <h3 className="mt-5 font-serif text-xl font-semibold text-[#2E1F14]">
          {member.name}
        </h3>

        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {member.role}
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamCard;