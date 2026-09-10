import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { getProductsByCategory } from "@/Service/ProductServices";
import type { Product, ProductDetails } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface Props {
  categoryId: number | null;
}

const CategoryProductsPanel: React.FC<Props> = ({ categoryId }) => {
  const [products, setProducts] = useState<(Product | ProductDetails)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, [categoryId]);

  if (!categoryId) {
    return (
      <p className="p-2 text-xs text-muted-foreground">
        Select a category to see existing products here.
      </p>
    );
  }
  if (loading) return <p className="p-2 text-xs text-muted-foreground">Loading products...</p>;
  if (error) return <p className="p-2 text-xs text-destructive">{error}</p>;
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 p-4 text-center text-xs text-muted-foreground">
        <Package className="h-5 w-5" />
        No products yet in this category.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="px-1 pb-1 text-xs font-semibold uppercase text-muted-foreground">
        {products.length} existing product{products.length !== 1 ? "s" : ""}
      </p>
      {products.map((p) => (
        <Link
          key={p.id}
          to={`/dashboard/admin/products/${p.id}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded px-1.5 py-1.5 text-xs hover:bg-[#F3EAE0]"
        >
          <img src={p.primaryImage} alt={p.name} className="h-8 w-8 shrink-0 rounded object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[#2E1F14]">{p.name}</p>
            <p className="text-muted-foreground">{p.currency} {p.sellingPrice}</p>
          </div>
          <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"} className="shrink-0 text-[10px]">
            {p.status}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryProductsPanel;