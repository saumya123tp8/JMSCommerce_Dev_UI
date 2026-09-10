import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllVariants } from "@/Service/VariantServices";
import { getCustomizations } from "@/Service/CustomizationServices";
import { useCart } from "@/hooks/useCart";
import { useAppSelector } from "@/redux/hooks";
import {
  rememberOptionIds,
  getRememberedOptionIds,
  forgetOptionIds,
} from "@/lib/cartOptionsTracker";
import type { Variant } from "@/types/variant";
import type { CustomizationGroup } from "@/types/customization";
import type { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickAddDialog: React.FC<Props> = ({ product, open, onOpenChange }) => {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const { cart, add, update, remove } = useCart();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [groups, setGroups] = useState<CustomizationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selected attribute values, e.g. { 10: "Large", 11: "Cold" }
  const [attrSelections, setAttrSelections] = useState<Record<number, string>>({});
  // Selected customization option ids, per group id — SINGLE groups
  // hold one value, MULTIPLE groups hold several.
  const [optionSelections, setOptionSelections] = useState<Record<number, number[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) return;
    setAttrSelections({});
    setOptionSelections({});
    setQuantity(1);
    setLoading(true);

    Promise.all([
      getAllVariants(product.id),
      getCustomizations(product.id).catch(() => ({ productId: product.id, groups: [] })),
    ])
      .then(([variantData, customizationData]) => {
        setVariants(variantData);
        setGroups(customizationData.groups);
      })
      .catch(() => toast.error("Failed to load product options"))
      .finally(() => setLoading(false));
  }, [open, product.id]);

  // Distinct attribute definitions across all variants, e.g.
  // { 10: { name: "Size", values: ["Small","Large"] }, 11: { name: "Temperature", values: ["Cold","Hot"] } }
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
    Array.from(attributeOptions.keys()).every((id) => attrSelections[id]);

  // Once every attribute has a value picked, find the one variant
  // that matches all of them exactly.
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
        return { ...prev, [group.id ?? -1]: current.filter((id) => id !== optionId) };
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
            return s + o.adjustmentValue; // FIXED
          }, 0)
      );
    }, 0);
    return (matchedVariant.sellingPrice + addOn) * quantity;
  }, [matchedVariant, groups, optionSelections, quantity]);

  const canAdd = matchedVariant && matchedVariant.stock > 0 && !missingRequiredGroup && !submitting;

  const handleAdd = async () => {
    if (!auth?.isAuthenticated) {
      toast("Please log in to add items to your cart");
      onOpenChange(false);
      navigate("/login");
      return;
    }
    if (!matchedVariant) return;

    setSubmitting(true);
    try {
      const beforeIds = new Set((cart?.items ?? []).map((i) => i.id));
      await add({
        variantId: matchedVariant.id,
        quantity,
        customizationOptionIds: selectedOptionIds,
      });
      // Backend response shape doesn't return customizationOptionIds
      // per item (only display names) — remember what we sent so a
      // later quantity change on this line can resend the same ids.
      // See lib/cartOptionsTracker.ts for why this exists.
      setTimeout(() => {
        const current = cart?.items ?? [];
        const newItem = current.find((i) => !beforeIds.has(i.id));
        if (newItem) rememberOptionIds(newItem.id, selectedOptionIds);
      }, 0);

      // Reset the picker so another combo can be added without
      // closing the dialog — matches the "stay open" behavior from
      // the legacy modal's "Add new to Cart" button.
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

  // Existing cart lines for THIS product — mirrors the legacy
  // CustomizeDeleteProductCard's productItems filter.
  const productCartItems = (cart?.items ?? []).filter((i) => i.productId === product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#2E1F14]">
            Customize your {product.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading options...</p>
        ) : (
          <div className="space-y-6 py-2">
            {/* Variant attribute pickers — real data, e.g. Size, Temperature */}
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

            {allAttributesSelected && !matchedVariant && (
              <p className="text-sm text-destructive">That combination isn't available.</p>
            )}
            {matchedVariant && matchedVariant.stock === 0 && (
              <p className="text-sm text-destructive">This option is out of stock.</p>
            )}

            {/* Customization groups — real data, e.g. Milk, Toppings */}
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

            {/* Quantity */}
            <div className="flex items-center justify-between border-t border-[#E8DDD0] pt-4">
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

            <Button className="w-full" disabled={!canAdd} onClick={handleAdd}>
              {submitting
                ? "Adding..."
                : estimatedPrice
                ? `Add to Cart — ${product.currency} ${estimatedPrice.toFixed(0)}`
                : "Select options"}
            </Button>

            {/* Existing cart lines for this product — mirrors the
                legacy screenshot's stacked "coffffeeee" cards, each
                with its own tags, stepper, and remove action. */}
            {productCartItems.length > 0 && (
              <div className="border-t border-[#E8DDD0] pt-4">
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddDialog;