import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getProductDetails } from "@/Service/ProductServices";
import { getVariant, getAllVariants, createVariant, updateVariant } from "@/Service/VariantServices";
import { useInheritedSpecifications } from "@/hooks/useInheritedSpecifications";
import { filterByScope } from "@/lib/specificationUtils";
import { variantSchema, type VariantFormValues } from "@/schema/variantSchema";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { ProductDetails } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  productId: number;
  variantId: number | null; // null = create
  onSaved: (productId: number, wasFirstVariant: boolean) => void;
  onCancel: () => void;
}

const emptyValues: VariantFormValues = { mrp: 0, sellingPrice: 0, stock: 0, sku: "", barcode: "" };

const VariantWorkbenchForm: React.FC<Props> = ({ productId, variantId, onSaved, onCancel }) => {
  const isEdit = variantId !== null;
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [attrValues, setAttrValues] = useState<Record<number, string>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { specifications: allInherited } = useInheritedSpecifications(productDetails?.category.id);
  const attributeSchema = filterByScope(allInherited, "VARIANT_ATTRIBUTE");

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: emptyValues,
  });

  const loadForVariant = async (details: ProductDetails) => {
    if (isEdit && variantId) {
      const variant = await getVariant(productId, variantId);
      form.reset({
        mrp: variant.mrp,
        sellingPrice: variant.sellingPrice,
        stock: variant.stock,
        sku: variant.sku,
        barcode: variant.barcode,
      });
      setAttrValues(
        Object.fromEntries(variant.attributes.map((a) => [a.specificationDefinitionId, a.value]))
      );
    } else {
      form.reset(emptyValues);
      setAttrValues({});
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const details = await getProductDetails(productId);
        setProductDetails(details);
        console.log("product details : "+ details);
        console.log( productDetails);
        await loadForVariant(details);
      } catch (err) {
        toast.error(extractApiErrorMessage(err));
        onCancel();
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, variantId]);

  const onSubmit = async (values: VariantFormValues) => {
    const missing = attributeSchema.filter((s) => !attrValues[s.id]?.trim());
    if (missing.length > 0) {
      toast.error(`Missing value for: ${missing[0].displayName}`);
      return;
    }

    const attributes = attributeSchema.map((s) => ({
      specificationDefinitionId: s.id,
      value: attrValues[s.id],
    }));

    setSubmitting(true);
    try {
      const payload = { ...values, attributes };
      let wasFirstVariant = false;

      if (isEdit && variantId) {
        await updateVariant(productId, variantId, payload);
        toast.success("Variant updated");
      } else {
        const existing = await getAllVariants(productId);
        wasFirstVariant = existing.length === 0;
        await createVariant(productId, payload);
        toast.success("Variant created");
      }

      onSaved(productId, wasFirstVariant);

      if (!isEdit) {
        // Stay in the form, reset for rapid entry of the next
        // combo (e.g. Large/Cold right after Small/Cold) instead of
        // bouncing back to the sidebar each time.
        form.reset(emptyValues);
        setAttrValues({});
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      {productDetails && (
        <div className="mb-6 flex gap-4 rounded-md border bg-muted/30 p-4">
          <img src={productDetails.primaryImage} alt={productDetails.name} className="h-16 w-16 rounded-md object-cover" />
          <div>
            <p className="font-serif text-lg text-[#2E1F14]">{productDetails.name}</p>
            <p className="text-sm text-muted-foreground">
              {productDetails.category.name} · {productDetails?.brand?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {productDetails.currency} {productDetails.sellingPrice} · {productDetails.status}
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="mrp" render={({ field }) => (
              <FormItem>
                <FormLabel>MRP</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sellingPrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="stock" render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="sku" render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl><Input placeholder="e.g. CC-S-COLD" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode</FormLabel>
                <FormControl><Input placeholder="e.g. 8901234567890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {attributeSchema.length > 0 && (
            <div className="space-y-3 rounded-md border p-4">
              <p className="text-sm font-medium">Variant Attributes</p>
              {attributeSchema.map((spec) => (
                <div key={spec.id}>
                  <label className="mb-1 block text-sm">
                    {spec.displayName}
                    <span className="text-destructive"> *</span>
                    {spec.unit && <span className="text-muted-foreground"> ({spec.unit})</span>}
                  </label>
                  <Input
                    placeholder={spec.placeholder ?? undefined}
                    value={attrValues[spec.id] ?? ""}
                    onChange={(e) => setAttrValues((prev) => ({ ...prev, [spec.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Variant"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VariantWorkbenchForm;