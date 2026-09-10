import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import { getAllBrands } from "@/Service/BrandServices";
import CategoryProductsPanel from "@/components/admin/CategoryProductsPanel";
import {
  getProductById,
  getProductSpecifications,
  createProduct,
  updateProduct,
} from "@/Service/ProductServices";
import { productSchema, type ProductFormValues } from "@/schema/productSchema";
import { extractApiErrorMessage } from "@/lib/apiError";
import { stageCustomizations } from "@/lib/productSetupStaging";
import type { Brand } from "@/types/brand";
import type { ProductSpecificationInput } from "@/types/product";
import type { CustomizationRequest } from "@/types/customization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CategoryCascadeSelector from "../../../components/admin/CategoryCascadeSelector";
import ProductSpecificationValuesEditor from "@/components/admin/ProductSpecificationValuesEditor";
import CustomizationGroupsEditor from "@/components/admin/CustomizationGroupsEditor";

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { categories } = useCategories({ activeOnly: true });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Existing product-level specification values are preserved
  // silently on edit (not shown/editable here) so that updating
  // other fields doesn't wipe them out — the backend replaces the
  // full specification set on every update.
  const existingSpecs = useRef<ProductSpecificationInput[]>([]);

  // Fixed (PRODUCT-scoped) specification values, filled in on create.
  const [specValues, setSpecValues] = useState<Record<number, string>>({});

  // Customization groups staged now, submitted once the product's
  // first variant is created and the product becomes ACTIVE — see
  // lib/productSetupStaging.ts for why this staging exists.
  const [customizationGroups, setCustomizationGroups] = useState<CustomizationRequest>({
    groups: [],
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      currency: "INR",
      primaryImage: "",
      shortDescription: "",
      description: "",
      inventoryType: "FINITE",
    },
  });

  const categoryId = form.watch("categoryId");

  useEffect(() => {
    getAllBrands()
      .then(setBrands)
      .catch(() => toast.error("Failed to load brands"));
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const [product, specs] = await Promise.all([
          getProductById(Number(id)),
          getProductSpecifications(Number(id)),
        ]);
        form.reset({
          name: product.name,
          currency: product.currency,
          primaryImage: product.primaryImage,
          shortDescription: product.shortDescription,
          inventoryType: product.inventoryType,
          // description/categoryId/brandId aren't on the lightweight
          // ProductResponseDTO — confirm /details as the hydration
          // source if these need to be pre-filled correctly on edit.
          description: "",
          categoryId: undefined as unknown as number,
          brandId: undefined as unknown as number,
        });
        existingSpecs.current = specs.map((s) => ({
          specificationId: s.specificationId,
          value: s.value,
        }));
      } catch {
        toast.error("Failed to load product");
        navigate("/dashboard/admin/products");
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      // Create: send whatever fixed spec values the admin filled in.
      // Edit: resend whatever already existed, unchanged (this page
      // doesn't expose spec editing on edit — see existingSpecs note
      // above).
      const specifications = Object.entries(specValues)
        .filter(([, v]) => v.trim())
        .map(([specId, value]) => ({ specificationId: Number(specId), value }));

      const payload = {
        ...values,
        specifications: isEdit ? existingSpecs.current : specifications,
      };

      if (isEdit && id) {
        await updateProduct(Number(id), payload);
        toast.success("Product updated");
        navigate("/dashboard/admin/products");
      } else {
        const product = await createProduct(payload);

        if (customizationGroups.groups.length > 0) {
          stageCustomizations(product.id, customizationGroups);
        }

        toast.success(
          "Product created as draft — add a variant to activate it."
        );
        navigate(`/dashboard/admin/products/${product.id}/variants/new`);
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-6 text-muted-foreground">Loading product...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Form column — 2 of 3 grid tracks */}
        <div className="min-w-0 lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryCascadeSelector
                        categories={categories}
                        value={field.value ?? null}
                        onChange={(id) => field.onChange(id ?? undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {categoryId && (
                <>
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
                      const selectedBrand = brands.find(
                        (b) => String(b.id) === String(field.value)
                      );

                      return (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? String(field.value) : ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand">
                                  {selectedBrand?.name ?? "Select brand"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                  {b.name}
                                </SelectItem>
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
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="One-line summary" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Textarea placeholder="Full description" {...field} />
                        </FormControl>
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
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
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
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
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
                    <>
                      <div className="rounded-md border p-4">
                        <p className="mb-3 text-sm font-medium">Fixed Specifications</p>
                        <ProductSpecificationValuesEditor
                          categoryId={categoryId}
                          values={specValues}
                          onChange={setSpecValues}
                        />
                      </div>

                      <div className="rounded-md border p-4">
                        <p className="mb-1 text-sm font-medium">Customizations</p>
                        <p className="mb-3 text-xs text-muted-foreground">
                          Staged now, saved automatically once your first variant is added.
                        </p>
                        <CustomizationGroupsEditor
                          value={customizationGroups}
                          onChange={setCustomizationGroups}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard/admin/products")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? "Saving..."
                        : isEdit
                          ? "Save Changes"
                          : "Create Product"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
        {/* Sidebar — 1 of 3 grid tracks, sticky while scrolling */}
        <aside className="min-w-0 lg:col-span-1">
          <div className="sticky top-6 rounded-md border bg-white p-3">
            <p className="mb-2 text-sm font-medium text-[#2E1F14]">
              Products in this category
            </p>
            <CategoryProductsPanel categoryId={categoryId ?? null} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminProductForm;