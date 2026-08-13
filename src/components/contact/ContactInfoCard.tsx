import type { ReactNode } from "react";

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  value: string;
}

const ContactInfoCard = ({
  icon,
  title,
  value,
}: ContactInfoCardProps) => {
  return (
    <div className="flex gap-4 rounded-xl border border-neutral-200 p-5 transition hover:border-[#C9A96E] hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F4EE] text-[#C9A96E]">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold text-[#2E1F14]">
          {title}
        </h4>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ContactInfoCard;