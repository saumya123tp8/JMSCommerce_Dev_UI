import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { getProductDetails, getProductSpecifications } from "@/Service/ProductServices";
import { getAllVariants } from "@/Service/VariantServices";
import { getCustomizations } from "@/Service/CustomizationServices";
import { useCart } from "@/hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import { useProductReviews } from "@/hooks/useProductReviews";
import ReviewList from "@/components/product/ReviewList";
import ReviewForm from "@/components/product/ReviewForm";
import SimilarProducts from "@/components/product/SimilarProducts";
import ProductInfoAccordion from "@/components/product/ProductInfoAccordion";
import {
  rememberOptionIds,
  getRememberedOptionIds,
  forgetOptionIds,
} from "@/lib/cartOptionsTracker";
import type { ProductDetails, ProductSpecificationValue } from "@/types/product";
import type { Variant } from "@/types/variant";
import type { CustomizationGroup } from "@/types/customization";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const { cart, add, update, remove } = useCart();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [specs, setSpecs] = useState<ProductSpecificationValue[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [attrSelections, setAttrSelections] = useState<Record<number, string>>({});
  const [optionSelections, setOptionSelections] = useState<Record<number, number[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      getProductDetails(Number(id)),
      getProductSpecifications(Number(id)).catch(() => []),
      getAllVariants(Number(id)),
      getCustomizations(Number(id)).catch(() => ({ productId: Number(id), groups: [] })),
    ])
      .then(([productData, specData, variantData, customizationData]) => {
        setProduct(productData);
        setSpecs(specData);
        setVariants(variantData);
        setGroups(customizationData.groups);
      })
      .catch(() => {
        toast.error("Failed to load product");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const attributeOptions = useMemo(() => {
    const map = new Map<number, { name: string; values: Set<string> }>();
    variants.forEach((v) =>
      v.attributes.forEach((a) => {
        if (!map.has(a.specificationDefinitionId)) {
          map.set(a.specificationDefinitionId, {
            name: a.specificationName,
            values: new Set(),
          });
        }
        map.get(a.specificationDefinitionId)!.values.add(a.value);
      })
    );
    return map;
  }, [variants]);

  const allAttributesSelected =
    attributeOptions.size > 0 &&
    Array.from(attributeOptions.keys()).every((attrId) => attrSelections[attrId]);

  const matchedVariant = useMemo(() => {
    if (!allAttributesSelected) return null;
    return (
      variants.find((v) =>
        v.attributes.every((a) => attrSelections[a.specificationDefinitionId] === a.value)
      ) ?? null
    );
  }, [variants, attrSelections, allAttributesSelected]);

  const toggleOption = (group: CustomizationGroup, optionId: number) => {
    setOptionSelections((prev) => {
      const current = prev[group.id ?? -1] ?? [];
      if (group.selectionType === "SINGLE") {
        return { ...prev, [group.id ?? -1]: [optionId] };
      }
      const exists = current.includes(optionId);
      if (exists) {
        return { ...prev, [group.id ?? -1]: current.filter((oid) => oid !== optionId) };
      }
      if (group.maxSelection && current.length >= group.maxSelection) {
        toast(`You can select up to ${group.maxSelection} for ${group.name}`, { icon: "⚠️" });
        return prev;
      }
      return { ...prev, [group.id ?? -1]: [...current, optionId] };
    });
  };

  const missingRequiredGroup = groups.find(
    (g) => g.required && (optionSelections[g.id ?? -1]?.length ?? 0) < (g.minSelection || 1)
  );

  const selectedOptionIds = Object.values(optionSelections).flat();

  const estimatedPrice = useMemo(() => {
    if (!matchedVariant) return null;
    const addOn = groups.reduce((sum, g) => {
      const selected = optionSelections[g.id ?? -1] ?? [];
      return (
        sum +
        g.options
          .filter((o) => o.id !== undefined && selected.includes(o.id))
          .reduce((s, o) => {
            if (o.adjustmentType === "PERCENTAGE") {
              return s + (matchedVariant.sellingPrice * o.adjustmentValue) / 100;
            }
            return s + o.adjustmentValue;
          }, 0)
      );
    }, 0);
    return (matchedVariant.sellingPrice + addOn) * quantity;
  }, [matchedVariant, groups, optionSelections, quantity]);

  const canAdd = matchedVariant && matchedVariant.stock > 0 && !missingRequiredGroup && !submitting;
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useProductReviews(Number(id));

  const handleAdd = async () => {
    if (!auth?.isAuthenticated) {
      toast("Please log in to add items to your cart");
      navigate("/login");
      return;
    }
    if (!matchedVariant || !product) return;

    setSubmitting(true);
    try {
      const beforeIds = new Set((cart?.items ?? []).map((i) => i.id));
      await add({
        variantId: matchedVariant.id,
        quantity,
        customizationOptionIds: selectedOptionIds,
      });
      setTimeout(() => {
        const current = cart?.items ?? [];
        const newItem = current.find((i) => !beforeIds.has(i.id));
        if (newItem) rememberOptionIds(newItem.id, selectedOptionIds);
      }, 0);

      setAttrSelections({});
      setOptionSelections({});
      setQuantity(1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLineQtyChange = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    const optionIds = getRememberedOptionIds(cartItemId);
    if (optionIds === null) {
      toast("Can't adjust quantity for this item — remove and re-add it instead.");
      return;
    }
    await update(cartItemId, { quantity: newQty, customizationOptionIds: optionIds });
  };

  const handleLineRemove = async (cartItemId: string) => {
    await remove(cartItemId);
    forgetOptionIds(cartItemId);
  };

  const productCartItems = product
    ? (cart?.items ?? []).filter((i) => i.productId === product.id)
    : [];

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          Loading product...
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  // const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useProductReviews(Number(id));


  return (
    <Layout title={`${product.name} — Ambani Coffee`} description={product.shortDescription}>
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <p className="mb-6 text-xs uppercase tracking-wide text-muted-foreground">
          {product.category.name} {product.brand?.name && `· ${product.brand.name}`}
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-2xl bg-[#F3EAE0]">
            <img
              src={product.primaryImage}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info + selection */}
          <div>
            <h1 className="mb-2 font-serif text-3xl text-[#2E1F14]">{product.name}</h1>

            {product.rating > 0 && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">★ {product.rating.toFixed(1)}</Badge>
                <span>
                  {product.ratingCount} ratings · {product.reviewCount} reviews
                </span>
              </div>
            )}

            <p className="mb-6 text-muted-foreground">{product.description}</p>

            {/* Variant attribute pickers */}
            <div className="space-y-5">
              {Array.from(attributeOptions.entries()).map(([attrId, attr]) => (
                <div key={attrId}>
                  <p className="mb-2 text-sm font-medium text-[#2E1F14]">{attr.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(attr.values).map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setAttrSelections((prev) => ({ ...prev, [attrId]: value }))
                        }
                        className={cn(
                          "rounded-md border px-4 py-2 text-sm transition-colors",
                          attrSelections[attrId] === value
                            ? "border-[#2E1F14] bg-[#2E1F14] text-white"
                            : "border-[#E8DDD0] text-[#5C4A3A] hover:bg-[#F3EAE0]"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {allAttributesSelected && !matchedVariant && (
              <p className="mt-3 text-sm text-destructive">That combination isn't available.</p>
            )}
            {matchedVariant && matchedVariant.stock === 0 && (
              <p className="mt-3 text-sm text-destructive">This option is out of stock.</p>
            )}

            {/* Customization groups */}
            {groups.length > 0 && (
              <div className="mt-6 space-y-5">
                {groups.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-sm font-medium text-[#2E1F14]">
                      {group.name}
                      {group.required && <span className="text-destructive"> *</span>}
                    </p>
                    <div className="space-y-2">
                      {group.options.map((option) => {
                        const selected = (optionSelections[group.id ?? -1] ?? []).includes(
                          option.id ?? -1
                        );
                        return (
                          <label
                            key={option.id}
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm",
                              selected ? "border-[#2E1F14] bg-[#F3EAE0]" : "border-[#E8DDD0]"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={() =>
                                  option.id !== undefined && toggleOption(group, option.id)
                                }
                              />
                              {option.name}
                            </span>
                            {option.adjustmentValue > 0 && (
                              <span className="text-muted-foreground">
                                +
                                {option.adjustmentType === "PERCENTAGE"
                                  ? `${option.adjustmentValue}%`
                                  : `₹${option.adjustmentValue}`}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + add */}
            <div className="mt-6 flex items-center justify-between border-t border-[#E8DDD0] pt-5">
              <span className="text-sm font-medium text-[#2E1F14]">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DDD0]"
                >
                  −
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DDD0]"
                >
                  +
                </button>
              </div>
            </div>

            <Button className="mt-4 w-full" size="lg" disabled={!canAdd} onClick={handleAdd}>
              {submitting
                ? "Adding..."
                : estimatedPrice
                ? `Add to Cart — ${product.currency} ${estimatedPrice.toFixed(0)}`
                : "Select options"}
            </Button>

            {/* Existing cart lines for this product */}
            {productCartItems.length > 0 && (
              <div className="mt-6 border-t border-[#E8DDD0] pt-5">
                <p className="mb-3 text-sm font-medium text-[#2E1F14]">
                  Already in your cart ({productCartItems.length})
                </p>
                <div className="space-y-3">
                  {productCartItems.map((item) => (
                    <div key={item.id} className="rounded-md border border-[#E8DDD0] p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#2E1F14]">{item.variantName}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLineQtyChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8DDD0] disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleLineQtyChange(item.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8DDD0]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {item.selectedCustomizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                          {item.selectedCustomizations.map((c) => (
                            <span key={c} className="rounded-full bg-[#F3EAE0] px-2 py-0.5">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-[#2E1F14]">
                          ₹{item.totalPrice.toFixed(0)}
                        </span>
                        <button
                          onClick={() => handleLineRemove(item.id)}
                          className="text-xs text-destructive underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications table */}
        {/* {specs.length > 0 && (
          <div className="mt-14 max-w-2xl">
            <h2 className="mb-4 font-serif text-2xl text-[#2E1F14]">Specifications</h2>
            <div className="overflow-hidden rounded-lg border border-[#E8DDD0]">
              {specs.map((spec, idx) => (
                <div
                  key={spec.specificationId}
                  className={cn(
                    "flex justify-between px-4 py-3 text-sm",
                    idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F2]"
                  )}
                >
                  <span className="text-muted-foreground">{spec.displayName}</span>
                  <span className="text-[#2E1F14]">
                    {spec.value}
                    {spec.unit ? ` ${spec.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}
        <ProductInfoAccordion specs={specs} groups={groups} />

<div className="mt-14 max-w-2xl">
  <h2 className="mb-4 font-serif text-2xl text-[#2E1F14]">Reviews</h2>
  <div className="mb-6">
    <ReviewList reviews={reviews} loading={reviewsLoading} />
  </div>
  {auth?.isAuthenticated && (
    <ReviewForm productId={Number(id)} onSubmitted={refetchReviews} />
  )}
</div>

<SimilarProducts categoryId={product.category.id} excludeProductId={product.id} />
      </div>
    </Layout>
  );
};

export default ProductDetailPage;