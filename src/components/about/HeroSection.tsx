import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="overflow-hidden border-b border-[#3d2a1d] bg-[#1F140E]">
      <div className="grid min-h-[620px] lg:grid-cols-2">
        {/* Left */}
        <div className="flex items-center px-8 py-16 lg:px-16">
          <div className="max-w-xl">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-[#C9A96E]">
              Est. 2018 · Specialty Coffee
            </p>

            <h1 className="font-serif text-5xl font-medium leading-tight text-white md:text-6xl">
              Where every cup tells a{" "}
              <span className="italic text-[#C9A96E]">
                story
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-[#B8A898]">
              A warm corner of the world where great coffee meets even better
              company. Sourced with care, brewed with precision.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="relative h-[420px] lg:h-auto">
          <img
            src="/images/abt.jpeg"
            alt="Coffee Shop"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;