import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";
import { findCategoryBySlug } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

const CategoryPage = () => {
  const { slug = "" } = useParams();
  const { categories, loading, error } = useCategories({ activeOnly: true });
  const category = findCategoryBySlug(categories, slug);
  const childCategories = categories.filter(
    (item) => item.parentId === category?.id,
  );

  return (
    <Layout title={category ? `${category.name} - Categories` : "Category"}>
      <section className="container mx-auto px-4 py-10 md:py-14">
        {loading && (
          <p className="text-center text-muted-foreground">Loading category...</p>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && !error && !category && (
          <div className="text-center">
            <h1 className="font-serif text-3xl text-[#2E1F14]">
              Category not found
            </h1>
            <Link
              to="/categories"
              className={cn(buttonVariants(), "mt-6 inline-flex")}
            >
              Back to categories
            </Link>
          </div>
        )}

        {category && (
          <>
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
                Category
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-4xl text-[#2E1F14]">
                  {category.name}
                </h1>
                <Badge variant="secondary">Level {category.level}</Badge>
              </div>
              {category.description && (
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {category.description}
                </p>
              )}
            </div>

            {childCategories.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 font-serif text-2xl text-[#2E1F14]">
                  Subcategories
                </h2>
                <div className="flex flex-wrap gap-3">
                  {childCategories.map((child) => (
                    <Link
                      key={child.id}
                      to={`/category/${child.slug}`}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-dashed border-[#E8DDD0] bg-[#FAF7F2] px-6 py-10 text-center">
              <p className="text-muted-foreground">
                Product listing for this category will appear here once product
                APIs are connected.
              </p>
              <Link
                to="/"
                className={cn(buttonVariants({ variant: "link" }), "mt-2 inline-flex")}
              >
                Browse all products
              </Link>
            </div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default CategoryPage;
