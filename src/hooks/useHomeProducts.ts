import { useCallback, useEffect, useState } from "react";
import { getAllProducts, getProductsByCategory } from "@/Service/ProductServices";
import type { Product, ProductDetails } from "@/types/product";

export function useHomeProducts(categoryId: number | null) {
  const [products, setProducts] = useState<(Product | ProductDetails)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = categoryId
        ? await getProductsByCategory(categoryId)
        : await getAllProducts();
      // Only ACTIVE products are shown to customers — DRAFT products
      // (no variant yet) aren't purchasable and shouldn't appear here.
      setProducts(data.filter((p) => p.status === "ACTIVE"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}