import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProductById } from "@/Service/ProductServices";
import { getCustomizations, createCustomizations, updateCustomizations } from "@/Service/CustomizationServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import CustomizationGroupsEditor from "@/components/admin/CustomizationGroupsEditor";
import type { CustomizationRequest } from "@/types/customization";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface Props {
  productId: number;
  onSaved: () => void;
  onCancel: () => void;
}

const CustomizationWorkbenchPanel: React.FC<Props> = ({ productId, onSaved, onCancel }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [current, setCurrent] = useState<CustomizationRequest>({ groups: [] });
  const [draft, setDraft] = useState<CustomizationRequest>({ groups: [] });
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, existing] = await Promise.all([
          getProductById(productId),
          getCustomizations(productId).catch(() => ({ productId, groups: [] })),
        ]);
        setProduct(p);
        setCurrent(existing);
        setDraft(existing);
        setHasExisting(existing.groups.length > 0);
      } catch (err) {
        toast.error(extractApiErrorMessage(err));
        onCancel();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (hasExisting) {
        await updateCustomizations(productId, draft);
        toast.success("Customizations updated");
      } else {
        await createCustomizations(productId, draft);
        toast.success("Customizations created");
      }
      onSaved();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      {product && (
        <div className="mb-6 flex gap-4 rounded-md border bg-muted/30 p-4">
          <img src={product.primaryImage} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
          <div>
            <p className="font-serif text-lg text-[#2E1F14]">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {product.currency} {product.sellingPrice} · {product.status}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-md border p-4">
        <p className="mb-3 text-sm font-medium">Current Customizations</p>
        {current.groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No customizations set up yet.</p>
        ) : (
          <div className="space-y-3">
            {current.groups.map((g, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="text-sm font-medium text-[#2E1F14]">
                  {g.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({g.selectionType}
                    {g.required ? ", required" : ""})
                  </span>
                </p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {g.options.map((o, j) => (
                    <li key={j}>
                      • {o.name}{" "}
                      {o.adjustmentValue > 0 &&
                        `+${o.adjustmentType === "PERCENTAGE" ? `${o.adjustmentValue}%` : `₹${o.adjustmentValue}`}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-md border p-4">
        <p className="mb-3 text-sm font-medium">Edit Customizations</p>
        <CustomizationGroupsEditor value={draft} onChange={setDraft} />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={submitting}>
          {submitting ? "Saving..." : "Save Customizations"}
        </Button>
      </div>
    </div>
  );
};

export default CustomizationWorkbenchPanel;