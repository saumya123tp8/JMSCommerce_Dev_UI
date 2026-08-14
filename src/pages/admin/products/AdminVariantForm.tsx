import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getProductDetails } from "@/Service/ProductServices";
import { getVariant, createVariant, updateVariant } from "@/Service/VariantServices";
import { useInheritedSpecifications } from "@/hooks/useInheritedSpecifications";
import { variantSchema, type VariantFormValues } from "@/schema/variantSchema";
import { extractApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminVariantForm: React.FC = () => {
  const { productId, variantId } = useParams<{
    productId: string;
    variantId: string;
  }>();
  const navigate = useNavigate();
  const isEdit = Boolean(variantId);

  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [attrValues, setAttrValues] = useState<Record<number, string>>({});
  // Tracks which OPTIONAL specs the admin has chosen to include on
  // this variant. Required specs are always included and don't
  // need an entry here.
  const [includedOptional, setIncludedOptional] = useState<Set<number>>(
    new Set()
  );
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { specifications: applicableSpecs, loading: specsLoading } =
    useInheritedSpecifications(categoryId);

  const requiredSpecs = applicableSpecs.filter((s) => s.required);
  const optionalSpecs = applicableSpecs.filter((s) => !s.required);

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues: { mrp: 0, sellingPrice: 0, stock: 0, sku: "", barcode: "" },
  });

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        // categoryId isn't on the lightweight product DTO per the
        // API doc — /details is used here since attribute
        // validation depends on knowing the product's category.
        const details = await getProductDetails(Number(productId));
        setCategoryId(details.category.id);

        if (isEdit && variantId) {
          const variant = await getVariant(Number(productId), Number(variantId));
          form.reset({
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            stock: variant.stock,
            sku: variant.sku,
            barcode: variant.barcode,
          });
          const values = Object.fromEntries(
            variant.attributes.map((a) => [a.specificationDefinitionId, a.value])
          );
          setAttrValues(values);
          // Any optional spec that already has a saved value should
          // show as "included" and pre-filled when editing.
          setIncludedOptional(new Set(Object.keys(values).map(Number)));
        }
      } catch (err) {
        toast.error(extractApiErrorMessage(err));
        navigate(`/dashboard/admin/products/${productId}/variants`);
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, variantId, isEdit]);

  const toggleOptional = (specId: number, checked: boolean) => {
    setIncludedOptional((prev) => {
      const next = new Set(prev);
      checked ? next.add(specId) : next.delete(specId);
      return next;
    });
    if (!checked) {
      // Clear the value so it doesn't get silently resubmitted if
      // re-checked later, and so it's correctly excluded on submit.
      setAttrValues((prev) => {
        const next = { ...prev };
        delete next[specId];
        return next;
      });
    }
  };

  const onSubmit = async (values: VariantFormValues) => {
    if (!productId) return;

    // Required specs must all have a value — strict enforcement,
    // blocks submit rather than silently dropping them.
    const missingRequired = requiredSpecs.filter(
      (s) => !attrValues[s.id]?.trim()
    );
    if (missingRequired.length > 0) {
      toast.error(
        `Missing required attribute: ${missingRequired[0].displayName}`
      );
      return;
    }

    const attributes = [
      ...requiredSpecs.map((s) => ({
        specificationDefinitionId: s.id,
        value: attrValues[s.id],
      })),
      ...optionalSpecs
        .filter((s) => includedOptional.has(s.id) && attrValues[s.id]?.trim())
        .map((s) => ({
          specificationDefinitionId: s.id,
          value: attrValues[s.id],
        })),
    ];

    setSubmitting(true);
    try {
      const payload = { ...values, attributes };
      if (isEdit && variantId) {
        await updateVariant(Number(productId), Number(variantId), payload);
        toast.success("Variant updated");
      } else {
        await createVariant(Number(productId), payload);
        toast.success("Variant created");
      }
      navigate(`/dashboard/admin/products/${productId}/variants`);
    } catch (err) {
      // Backend validates SKU/barcode uniqueness and duplicate
      // variant definitions here — surfaced directly to the admin.
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Variant" : "New Variant"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MRP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CC-S-COLD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 8901234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Required specs — always shown, always enforced,
              no checkbox since exclusion isn't allowed. */}
          {!specsLoading && requiredSpecs.length > 0 && (
            <div className="space-y-3 rounded-md border p-4">
              <p className="text-sm font-medium">Required Attributes</p>
              {requiredSpecs.map((spec) => (
                <div key={spec.id}>
                  <label className="mb-1 block text-sm">
                    {spec.displayName}
                    <span className="text-destructive"> *</span>
                    {spec.unit && (
                      <span className="text-muted-foreground"> ({spec.unit})</span>
                    )}
                  </label>
                  <Input
                    placeholder={spec.placeholder ?? undefined}
                    value={attrValues[spec.id] ?? ""}
                    onChange={(e) =>
                      setAttrValues((prev) => ({
                        ...prev,
                        [spec.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Optional specs — every specification available for this
              category is listed so the admin can pick which apply
              to this specific variant (e.g. "Size" and "Temperature"
              for one variant, just "Size" for another). */}
          {!specsLoading && optionalSpecs.length > 0 && (
            <div className="space-y-3 rounded-md border p-4">
              <p className="text-sm font-medium">Optional Attributes</p>
              <p className="text-xs text-muted-foreground">
                Select which attributes apply to this variant.
              </p>
              {optionalSpecs.map((spec) => {
                const isIncluded = includedOptional.has(spec.id);
                return (
                  <div key={spec.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`spec-${spec.id}`}
                        checked={isIncluded}
                        onCheckedChange={(checked) =>
                          toggleOptional(spec.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`spec-${spec.id}`}
                        className="text-sm"
                      >
                        {spec.displayName}
                        {spec.unit && (
                          <span className="text-muted-foreground"> ({spec.unit})</span>
                        )}
                      </label>
                    </div>
                    {isIncluded && (
                      <Input
                        placeholder={spec.placeholder ?? undefined}
                        value={attrValues[spec.id] ?? ""}
                        onChange={(e) =>
                          setAttrValues((prev) => ({
                            ...prev,
                            [spec.id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!specsLoading &&
            applicableSpecs.length === 0 &&
            categoryId && (
              <p className="text-sm text-muted-foreground">
                No specifications defined for this category yet.
              </p>
            )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/dashboard/admin/products/${productId}/variants`)
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Variant"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminVariantForm;