import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-[#2E1F14] py-20">

      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:text-left">

        <div>

          <h2 className="font-serif text-4xl text-white">
            Come Visit Us Today
          </h2>

          <p className="mt-4 text-[#C9A96E]">
            Open Daily • 7 AM – 10 PM
          </p>

        </div>

        <Button
          size="lg"
          className="bg-[#C9A96E] text-[#2E1F14] hover:bg-[#B99863]"
        >
          Get Directions
        </Button>

      </div>

    </section>
  );
};

export default CTASection;