import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Store } from "lucide-react";

interface PolicySection {
  id: string;
  heading: string;
  content: string[];
}

interface PolicyLayoutProps {
  label: string;
  title: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  label,
  title,
  updated,
  intro,
  sections,
}) => {
  return (
    <>
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="border-b pb-8">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">Updated {updated}</p>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </header>

      <div className="grid gap-10 py-10 md:grid-cols-[180px_1fr]">
        <nav className="hidden md:block">
          <ul className="sticky top-24 space-y-3 border-l pl-4 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                
                  <a href={`#${s.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {i + 1}. {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-lg font-semibold text-foreground">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {s.content.map((p, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-md border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">Still have questions?</p>
          <p className="text-sm text-muted-foreground">
            Our support team can walk you through the details.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" >
            <Link to="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact support
            </Link>
          </Button>
          <Button >
            <Link to="/">
              <Store className="mr-2 h-4 w-4" />
              Back to store
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default PolicyLayout;