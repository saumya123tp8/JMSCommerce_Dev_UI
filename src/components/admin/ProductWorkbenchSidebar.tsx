import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProductsByCategory } from "@/Service/ProductServices";
import { getAllVariants } from "@/Service/VariantServices";
import type { Product, ProductDetails } from "@/types/product";
import type { Variant } from "@/types/variant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Pencil, Plus, Settings2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  categoryId: number | null;
  refreshKey: number;
  activeProductId: number | null;
  onCreateProduct: () => void;
  onEditProduct: (productId: number) => void;
  onAddVariant: (productId: number) => void;
  onEditVariant: (productId: number, variantId: number) => void;
  onManageCustomization: (productId: number) => void;
}

const ProductWorkbenchSidebar: React.FC<Props> = ({
  categoryId,
  refreshKey,
  activeProductId,
  onCreateProduct,
  onEditProduct,
  onAddVariant,
  onEditVariant,
  onManageCustomization,
}) => {
  const [products, setProducts] = useState<(Product | ProductDetails)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [variantsCache, setVariantsCache] = useState<Record<number, Variant[]>>({});
  const [variantsLoading, setVariantsLoading] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError(null);
    getProductsByCategory(categoryId)
      .then(setProducts)
      .catch(() => setError("Failed to load products for this category"))
      .finally(() => setLoading(false));
  }, [categoryId, refreshKey]);

  const toggleExpand = async (productId: number) => {
    const next = new Set(expanded);
    if (next.has(productId)) {
      next.delete(productId);
      setExpanded(next);
      return;
    }
    next.add(productId);
    setExpanded(next);

    if (!variantsCache[productId]) {
      setVariantsLoading((prev) => new Set(prev).add(productId));
      try {
        const variants = await getAllVariants(productId);
        setVariantsCache((prev) => ({ ...prev, [productId]: variants }));
      } catch {
        toast.error("Failed to load variants");
      } finally {
        setVariantsLoading((prev) => {
          const s = new Set(prev);
          s.delete(productId);
          return s;
        });
      }
    }
  };

  // Called after a variant save so the expanded row's cache is
  // stale-refreshed rather than showing outdated data until next
  // manual toggle.
  const refreshVariants = async (productId: number) => {
    try {
      const variants = await getAllVariants(productId);
      setVariantsCache((prev) => ({ ...prev, [productId]: variants }));
    } catch {
      // Non-fatal — row will just show pre-refresh data until next expand toggle.
    }
  };

  // Exposed so the parent workbench can force a variant-list refresh
  // for a specific product after a save, without re-fetching the
  // whole product list.
  useEffect(() => {
    if (activeProductId && variantsCache[activeProductId]) {
      refreshVariants(activeProductId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  if (!categoryId) {
    return (
      <p className="p-3 text-xs text-muted-foreground">
        Select a category to see its products here.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-[#2E1F14]">Products in this category</p>
        <Button size="sm" variant="outline" onClick={onCreateProduct}>
          <Plus className="mr-1 h-3 w-3" />
          New
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Loading products...</p>
      ) : error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-6 text-center text-xs text-muted-foreground">
          <Package className="h-5 w-5" />
          No products yet in this category.
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => {
            const isExpanded = expanded.has(p.id);
            const variants = variantsCache[p.id] ?? [];
            const isDraft = p.status === "DRAFT";

            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-md border",
                  activeProductId === p.id && "border-[#2E1F14] ring-1 ring-[#2E1F14]"
                )}
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    onClick={() => toggleExpand(p.id)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-muted"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <img
                    src={p.primaryImage}
                    alt={p.name}
                    className="h-8 w-8 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#2E1F14]">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.currency} {p.sellingPrice}
                    </p>
                  </div>
                  <Badge variant={isDraft ? "secondary" : "default"} className="shrink-0 text-[10px]">
                    {p.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => onEditProduct(p.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {isExpanded && (
                  <div className="space-y-1 border-t bg-muted/20 p-2">
                    {isDraft && (
                      <p className="px-1 text-xs text-amber-700">
                        Add a variant to activate this product.
                      </p>
                    )}

                    {variantsLoading.has(p.id) ? (
                      <p className="px-1 text-xs text-muted-foreground">Loading variants...</p>
                    ) : variants.length === 0 ? (
                      <p className="px-1 text-xs text-muted-foreground">No variants yet.</p>
                    ) : (
                      variants.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between rounded px-2 py-1 text-xs hover:bg-white"
                        >
                          <span className="text-[#2E1F14]">{v.displayName}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              ₹{v.sellingPrice} · stock {v.stock}
                            </span>
                            <button
                              onClick={() => onEditVariant(p.id, v.id)}
                              className="text-muted-foreground hover:text-[#2E1F14]"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      ))
                    )}

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => onAddVariant(p.id)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Variant
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        disabled={isDraft}
                        title={isDraft ? "Add a variant first to activate this product" : undefined}
                        onClick={() => onManageCustomization(p.id)}
                      >
                        <Settings2 className="mr-1 h-3 w-3" />
                        Customization
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductWorkbenchSidebar;