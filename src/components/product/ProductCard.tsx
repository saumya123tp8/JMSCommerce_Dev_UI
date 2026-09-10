import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import QuickAddDialog from "./QuickAddDialog";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { cart } = useCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const onSale = product.sellingPrice < product.mrp;

  const totalInCart = (cart?.items ?? [])
    .filter((i) => i.productId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        className="group block overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-[#F3EAE0]">
          <img
            src={product.primaryImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-[#C9A96E] px-2.5 py-1 text-xs font-semibold text-white">
              Sale
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
            {product.brandName}
          </p>
          <h3 className="mb-2 font-serif text-lg text-[#2E1F14]">{product.name}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-[#2E1F14]">
                {product.currency} {product.sellingPrice.toFixed(0)}
              </span>
              {onSale && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.mrp.toFixed(0)}
                </span>
              )}
            </div>
            {product.rating > 0 && (
              <Badge variant="secondary" className="text-xs">
                ★ {product.rating.toFixed(1)}
              </Badge>
            )}
          </div>

          {totalInCart > 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setDialogOpen(true);
              }}
              className="mt-3 flex w-full items-center justify-between rounded-md border border-[#2E1F14] px-3 py-2 text-sm font-medium text-[#2E1F14]"
            >
              <span>{totalInCart} in cart</span>
              <span className="underline">Manage</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                setDialogOpen(true);
              }}
              className="mt-3 w-full rounded-md bg-[#2E1F14] py-2 text-sm font-medium text-white transition-colors hover:bg-[#3D2A1A]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </Link>

      <QuickAddDialog product={product} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default ProductCard;