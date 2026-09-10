import { useInheritedSpecifications } from "@/hooks/useInheritedSpecifications";
import { filterByScope } from "@/lib/specificationUtils";
import { Input } from "@/components/ui/input";

interface Props {
  categoryId: number | undefined;
  values: Record<number, string>;
  onChange: (values: Record<number, string>) => void;
}

// Shows every specification inherited for the selected category
// (through the parent hierarchy) that is scoped to PRODUCT level —
// i.e. gets one fixed value for the whole product. VARIANT-scoped
// specs are intentionally excluded here; they're collected per
// variant instead, in AdminVariantForm.
const ProductSpecificationValuesEditor: React.FC<Props> = ({
  categoryId,
  values,
  onChange,
}) => {
  const { specifications, loading } = useInheritedSpecifications(categoryId);
  const fixedSpecs = filterByScope(specifications, "PRODUCT_SPECIFICATION");

  if (!categoryId) {
    return (
      <p className="text-sm text-muted-foreground">Select a category first.</p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading specifications...</p>
    );
  }

  if (fixedSpecs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No product-level specifications defined for this category.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {fixedSpecs.map((spec) => (
        <div key={spec.id}>
          <label className="mb-1 block text-sm">
            {spec.displayName}
            {spec.required && <span className="text-destructive"> *</span>}
            {spec.unit && (
              <span className="text-muted-foreground"> ({spec.unit})</span>
            )}
          </label>
          <Input
            placeholder={spec.placeholder ?? undefined}
            value={values[spec.id] ?? ""}
            onChange={(e) =>
              onChange({ ...values, [spec.id]: e.target.value })
            }
          />
          {spec.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {spec.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductSpecificationValuesEditor;