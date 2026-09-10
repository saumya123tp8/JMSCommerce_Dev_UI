import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getAllBrands } from "@/Service/BrandServices";
import { getProductById, createProduct, updateProduct } from "@/Service/ProductServices";
import { productSchema, type ProductFormValues } from "@/schema/productSchema";
import { extractApiErrorMessage } from "@/lib/apiError";
import ProductSpecificationValuesEditor from "@/components/admin/ProductSpecificationValuesEditor";
import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
  categoryId: number;
  category: Category;
  productId: number | null; // null = create, number = edit
  onSaved: (productId: number, wasCreate: boolean) => void;
  onCancel: () => void;
}

const ProductWorkbenchForm: React.FC<Props> = ({ categoryId, category, productId, onSaved, onCancel }) => {
  const isEdit = productId !== null;
  const [brands, setBrands] = useState<Brand[]>([]);
  const [specValues, setSpecValues] = useState<Record<number, string>>({});
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId,
      name: "",
      currency: "INR",
      primaryImage: "",
      shortDescription: "",
      description: "",
      inventoryType: "FINITE",
    },
  });

  useEffect(() => {
    getAllBrands().then(setBrands).catch(() => toast.error("Failed to load brands"));
  }, []);

  useEffect(() => {
    if (!isEdit || !productId) return;
    (async () => {
      try {
        const product = await getProductById(productId);
        form.reset({
          categoryId,
          name: product.name,
          currency: product.currency,
          primaryImage: product.primaryImage,
          shortDescription: product.shortDescription,
          inventoryType: product.inventoryType,
          description: "", // see earlier note re: lightweight DTO gap
          brandId: undefined as unknown as number,
        });
      } catch {
        toast.error("Failed to load product");
        onCancel();
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, isEdit]);

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const specifications = Object.entries(specValues)
        .filter(([, v]) => v.trim())
        .map(([specId, value]) => ({ specificationId: Number(specId), value }));

      const payload = { ...values, categoryId, specifications: isEdit ? [] : specifications };

      if (isEdit && productId) {
        await updateProduct(productId, payload);
        toast.success("Product updated");
        onSaved(productId, false);
      } else {
        const product = await createProduct(payload);
        toast.success("Product created as draft — add a variant to activate it.");
        onSaved(product.id, true);
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <p className="text-sm text-muted-foreground">Loading product...</p>;
  }

  return (
    <div>
      <div className="mb-4 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
        {isEdit ? "Editing product in" : "Creating product in"}{" "}
        <span className="font-medium text-[#2E1F14]">{category.name}</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Cold Coffee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => {
              const selected = brands.find((b) => String(b.id) === String(field.value));
              return (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand">{selected?.name ?? "Select brand"}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="primaryImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Image URL</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl><Input placeholder="One-line summary" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Full description" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inventoryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="FINITE">Finite</SelectItem>
                      <SelectItem value="INFINITE">Infinite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isEdit && (
            <div className="rounded-md border p-4">
              <p className="mb-3 text-sm font-medium">Fixed Specifications</p>
              <ProductSpecificationValuesEditor categoryId={categoryId} values={specValues} onChange={setSpecValues} />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductWorkbenchForm;