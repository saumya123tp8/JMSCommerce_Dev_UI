import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/product/ProductCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { searchProducts } from "@/Service/ProductServices";

import type { Product } from "@/types/product";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A to Z" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface ProductFiltersProps {
  minPrice: string;
  maxPrice: string;
  minRating: string;
  saleOnly: boolean;

  onMinPrice: (value: string) => void;
  onMaxPrice: (value: string) => void;
  onMinRating: (value: string) => void;
  onSaleOnly: (value: boolean) => void;

  onClear: () => void;
}

function ProductFilters({
  minPrice,
  maxPrice,
  minRating,
  saleOnly,
  onMinPrice,
  onMaxPrice,
  onMinRating,
  onSaleOnly,
  onClear,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-[#2E1F14]">
          Filters
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>

      {/* Price */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#2E1F14]">
          Price
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label
              htmlFor="min-price"
              className="text-xs text-muted-foreground"
            >
              Min
            </Label>

            <Input
              id="min-price"
              inputMode="numeric"
              type="number"
              min="0"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => onMinPrice(e.target.value)}
            />
          </div>

          <div>
            <Label
              htmlFor="max-price"
              className="text-xs text-muted-foreground"
            >
              Max
            </Label>

            <Input
              id="max-price"
              inputMode="numeric"
              type="number"
              min="0"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => onMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Rating */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[#2E1F14]">
          Rating
        </h3>

        <Select
          value={minRating || "any"}
          onValueChange={(value) =>
            onMinRating(
              !value || value === "any" ? "" : value
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="any">
              Any rating
            </SelectItem>

            <SelectItem value="4">
              4★ and above
            </SelectItem>

            <SelectItem value="3">
              3★ and above
            </SelectItem>

            <SelectItem value="2">
              2★ and above
            </SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Sale */}
      <section>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E8DDD0] p-3">
          <Checkbox
            checked={saleOnly}
            onCheckedChange={(checked) =>
              onSaleOnly(checked === true)
            }
          />

          <span className="text-sm text-[#2E1F14]">
            On sale only
          </span>
        </label>
      </section>
    </div>
  );
}

const Search = () => {
  const [params, setParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /*
   * URL state
   *
   * Example:
   *
   * /search?search=coffee&minPrice=300&maxPrice=1500
   *        &minRating=4&sale=true&sort=price_asc&page=0
   */

  const query = params.get("search") ?? "";

  const minPrice = params.get("minPrice") ?? "";

  const maxPrice = params.get("maxPrice") ?? "";

  const minRating = params.get("minRating") ?? "";

  const saleOnly = params.get("sale") === "true";

  const sort =
    (params.get("sort") as SortValue) || "relevance";

  const page = Math.max(
    0,
    Number(params.get("page") ?? "0")
  );

  /*
   * Fetch products from backend
   */
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await searchProducts({
          search: query || undefined,

          minPrice: minPrice
            ? Number(minPrice)
            : undefined,

          maxPrice: maxPrice
            ? Number(maxPrice)
            : undefined,

          minRating: minRating
            ? Number(minRating)
            : undefined,

          sale: saleOnly
            ? true
            : undefined,

          sort,

          page,

          size: 12,
        });

        if (cancelled) {
          return;
        }

        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    query,
    minPrice,
    maxPrice,
    minRating,
    saleOnly,
    sort,
    page,
  ]);

  /*
   * Close mobile filter drawer when search changes
   */
  useEffect(() => {
    setMobileFiltersOpen(false);
  }, [query]);

  /*
   * Update URL parameter
   *
   * Whenever a filter changes, go back to page 0.
   */
  const updateParam = (
    key: string,
    value: string | null
  ) => {
    const next = new URLSearchParams(params);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    /*
     * Any filter/sort change should start from
     * the first page.
     */
    if (key !== "page") {
      next.set("page", "0");
    }

    setParams(next);
  };

  /*
   * Clear filters but preserve search query
   */
  const clearFilters = () => {
    const next = new URLSearchParams();

    if (query) {
      next.set("search", query);
    }

    next.set("page", "0");

    setParams(next);
  };

  /*
   * Pagination
   */
  const goToPage = (nextPage: number) => {
    if (
      nextPage < 0 ||
      nextPage >= totalPages
    ) {
      return;
    }

    updateParam("page", String(nextPage));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout
      title={
        query
          ? `Search results for ${query}`
          : "Search products"
      }
    >
      <section className="w-full min-w-0 overflow-x-clip bg-[#FAF7F2]">
        <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-6">

          {/* Page heading */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E]">
                Product discovery
              </p>

              <h1 className="mt-2 font-serif text-3xl text-[#2E1F14] sm:text-4xl">
                {query
                  ? `Results for “${query}”`
                  : "Browse products"}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Search, filter and sort products without
                losing your current selection.
              </p>
            </div>
          </div>

          {/* Mobile filter header */}
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#E8DDD0] bg-white p-3 lg:hidden">
            <span className="text-sm text-muted-foreground">
              {loading
                ? "Loading…"
                : `${totalElements} ${
                    totalElements === 1
                      ? "product"
                      : "products"
                  }`}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />

              Filters
            </Button>
          </div>

          {/* Mobile filter drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <button
                aria-label="Close filters"
                className="absolute inset-0 bg-black/30"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
              />

              <aside className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-[#E8DDD0] p-4">
                  <h2 className="font-serif text-xl text-[#2E1F14]">
                    Filters
                  </h2>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setMobileFiltersOpen(false)
                    }
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <ProductFilters
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    minRating={minRating}
                    saleOnly={saleOnly}
                    onMinPrice={(value) =>
                      updateParam(
                        "minPrice",
                        value
                      )
                    }
                    onMaxPrice={(value) =>
                      updateParam(
                        "maxPrice",
                        value
                      )
                    }
                    onMinRating={(value) =>
                      updateParam(
                        "minRating",
                        value
                      )
                    }
                    onSaleOnly={(value) =>
                      updateParam(
                        "sale",
                        value ? "true" : null
                      )
                    }
                    onClear={clearFilters}
                  />
                </div>

                <div className="border-t border-[#E8DDD0] p-4">
                  <Button
                    className="w-full"
                    onClick={() =>
                      setMobileFiltersOpen(false)
                    }
                  >
                    Show {totalElements}{" "}
                    {totalElements === 1
                      ? "product"
                      : "products"}
                  </Button>
                </div>
              </aside>
            </div>
          )}

          {/* Main content */}
          <div className="grid min-w-0 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">

            {/* Desktop filters */}
            <aside className="hidden rounded-2xl border border-[#E8DDD0] bg-white p-5 lg:block">
              <ProductFilters
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                saleOnly={saleOnly}
                onMinPrice={(value) =>
                  updateParam(
                    "minPrice",
                    value
                  )
                }
                onMaxPrice={(value) =>
                  updateParam(
                    "maxPrice",
                    value
                  )
                }
                onMinRating={(value) =>
                  updateParam(
                    "minRating",
                    value
                  )
                }
                onSaleOnly={(value) =>
                  updateParam(
                    "sale",
                    value ? "true" : null
                  )
                }
                onClear={clearFilters}
              />
            </aside>

            {/* Products */}
            <div className="min-w-0">

              {/* Sort */}
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#E8DDD0] bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">

                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading products…"
                    : `${totalElements} ${
                        totalElements === 1
                          ? "product"
                          : "products"
                      }`}
                </p>

                <Select
                  value={sort}
                  onValueChange={(value) =>
                    updateParam(
                      "sort",
                      value === "relevance"
                        ? null
                        : value
                    )
                  }
                >
                  <SelectTrigger className="w-full sm:w-[210px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    {SORT_OPTIONS.map(
                      (option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                    Loading products…
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading &&
                !error &&
                products.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#E8DDD0] bg-white px-6 py-16 text-center">
                    <h2 className="font-serif text-2xl text-[#2E1F14]">
                      No products found
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Try a different search or clear
                      some filters.
                    </p>

                    <Button
                      className="mt-5"
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}

              {/* Product grid */}
              {!loading &&
                !error &&
                products.length > 0 && (
                  <>
                    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                      {products.map(
                        (product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                          />
                        )
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex items-center justify-center gap-3">

                        <Button
                          type="button"
                          variant="outline"
                          disabled={page === 0}
                          onClick={() =>
                            goToPage(
                              page - 1
                            )
                          }
                        >
                          Previous
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          Page{" "}
                          {page + 1} of{" "}
                          {totalPages}
                        </span>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={
                            page >=
                            totalPages - 1
                          }
                          onClick={() =>
                            goToPage(
                              page + 1
                            )
                          }
                        >
                          Next
                        </Button>

                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Search;