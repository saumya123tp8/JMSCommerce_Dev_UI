import { useEffect, useState } from "react";
import { getProductsByCategory } from "@/Service/ProductServices";
import ProductCard from "@/components/product/ProductCard";
import type { Product, ProductDetails } from "@/types/product";

interface Props {
  categoryId: number;
  excludeProductId: number;
}

// No dedicated "related products" endpoint is documented — this
// reuses the existing category-search endpoint and just excludes
// the current product. A real recommendation endpoint (by
// similarity, purchase history, etc.) would be a better long-term
// source; flagged in the requirements list.
const SimilarProducts: React.FC<Props> = ({ categoryId, excludeProductId }) => {
  const [products, setProducts] = useState<(Product | ProductDetails)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(categoryId)
      .then((data) =>
        setProducts(data.filter((p) => p.id !== excludeProductId && p.status === "ACTIVE").slice(0, 4))
      )
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId, excludeProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="mb-4 font-serif text-2xl text-[#2E1F14]">You might also like</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;