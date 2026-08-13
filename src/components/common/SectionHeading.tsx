import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title?: string;
  description?: string;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("mb-10", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
        {eyebrow}
      </p>

      {title && (
        <h2 className="font-serif text-4xl font-semibold text-[#2E1F14]">
          {title}
        </h2>
      )}

      {description && (
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;