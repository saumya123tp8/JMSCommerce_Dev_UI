import Layout from "@/components/layout/Layout";
import CategoryCard from "@/components/category/CategoryCard";
import SectionHeading from "@/components/common/SectionHeading";
import { useCategories } from "@/hooks/useCategories";
import { buildCategoryTree } from "@/lib/categoryUtils";

const Categories = () => {
  const { categories, loading, error } = useCategories({ activeOnly: true });
  const categoryTree = buildCategoryTree(categories);

  return (
    <Layout title="Categories">
      <section className="container mx-auto px-4 py-10 md:py-14">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by Category"
          description="Explore our coffee and beverage collections, organized for easy browsing."
        />

        {loading && (
          <p className="text-center text-muted-foreground">Loading categories...</p>
        )}

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && !error && categoryTree.length === 0 && (
          <p className="text-center text-muted-foreground">
            No categories available yet.
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categoryTree.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
