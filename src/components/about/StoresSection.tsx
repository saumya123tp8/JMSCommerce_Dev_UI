import StoreCard from "./StoreCard";
import SectionHeading from "@/components/common/SectionHeading";

import { STORES } from "@/pages/aboutData";

const StoresSection = () => {
  return (
    <section className="container mx-auto px-6 py-20">

      <SectionHeading
        eyebrow="Our Stores"
        title="Find Us Near You"
        description="Every location carries the same passion for handcrafted coffee and welcoming spaces."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {STORES.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
          />
        ))}
      </div>

    </section>
  );
};

export default StoresSection;