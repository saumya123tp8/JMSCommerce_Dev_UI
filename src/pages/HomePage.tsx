


import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useHomeProducts } from "@/hooks/useHomeProducts";
import { usePagedList } from "@/hooks/usePagedList";
import CategoryFilterBar from "@/components/product/CategoryFilterBar";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import ProductFilterBar, {
  type ProductFilterValues,
} from "@/components/FilterBar/ProductFilterBar";

const HomePage: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { products, loading, error } = useHomeProducts(activeCategoryId);
  const { visibleItems, hasMore, loadMore, reset } = usePagedList(products, 12);
  const [filters, setFilters] = useState<ProductFilterValues>({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    saleOnly: false,
    inStock: false,
    sort: "relevance",
  });
  // Reset "load more" progress whenever the category filter changes,
  // so switching categories doesn't carry over a stale page count.
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryId]);

  return (
    <Layout
      title="Ambani Coffee — Handcrafted Coffee, Delivered"
      description="Explore Ambani Coffee's range of handcrafted coffee and beverages."
    >
      {/* Hero */}
      <section className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
            Ambani Coffee
          </p>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[#2E1F14] md:text-5xl">
            Coffee, brewed the way you like it
          </h1>
          <p className="max-w-md text-muted-foreground">
            Pick your roast, choose your milk, adjust the sweetness — every
            cup is built around you.
          </p>
          <Button size="lg" onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}>
            Shop the menu
          </Button>
        </div>
      </section>

      {/* Product listing */}
      <section id="shop" className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <CategoryFilterBar
            activeCategoryId={activeCategoryId}
            onChange={setActiveCategoryId}
          />
        </div>
            <ProductFilterBar
                values={filters}
                onChange={setFilters}
                onClear={() =>
                  setFilters({
                    minPrice: "",
                    maxPrice: "",
                    minRating: "",
                    saleOnly: false,
                    inStock: false,
                    sort: "relevance",
                  })
                }
              />

        {error && (
          <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-[#F3EAE0]"
              />
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center text-muted-foreground">
            No products found in this category yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {visibleItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={loadMore}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default HomePage;