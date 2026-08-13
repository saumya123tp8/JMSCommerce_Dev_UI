import React from "react";

const stats = [
  {
    value: "12+",
    label: "Origins Sourced",
  },
  {
    value: "6 yrs",
    label: "Of Craft",
  },
  {
    value: "500+",
    label: "Cups Daily",
  },
];

const StatsSection = () => {
  return (
    <section className="grid border-b border-[#3d2a1d] bg-[#1F140E] md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="border-r border-[#3d2a1d] px-10 py-10 last:border-r-0"
        >
          <h2 className="font-serif text-5xl text-[#C9A96E]">
            {item.value}
          </h2>

          <p className="mt-2 uppercase tracking-[0.2em] text-[#9F8D80]">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
};

export default StatsSection;