import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import {
  getSpecificationById,
  createSpecification,
  updateSpecification,
} from "@/Service/SpecificationServices";
import {
  specificationSchema,
  specificationDataTypes,
  type SpecificationFormValues,
} from "@/schema/specification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Layout from "@/components/layout/Layout"

const AdminSpecificationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { categories } = useCategories();
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SpecificationFormValues>({
    resolver: zodResolver(specificationSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      dataType: "STRING",
      unit: "",
      required: false,
      filterable: false,
      searchable: false,
      displayOrder: 1,
      placeholder: "",
      defaultValue: "",
      categoryId: searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : undefined,
    },
  });

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const spec = await getSpecificationById(Number(id));
        form.reset({
          name: spec.name,
          displayName: spec.displayName,
          description: spec.description ?? "",
          dataType: spec.dataType,
          unit: spec.unit ?? "",
          required: spec.required,
          filterable: spec.filterable,
          searchable: spec.searchable,
          displayOrder: spec.displayOrder,
          placeholder: spec.placeholder ?? "",
          defaultValue: spec.defaultValue ?? "",
          categoryId: spec.categoryId,
        });
      } catch {
        toast.error("Failed to load specification");
        navigate("/dashboard/admin/specifications");
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const onSubmit = async (values: SpecificationFormValues) => {
    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateSpecification(Number(id), values);
        toast.success("Specification updated");
      } else {
        await createSpecification(values);
        toast.success("Specification created");
      }
      navigate("/dashboard/admin/specifications");
    } catch (err: any) {
      // Most likely 400 here: duplicate specification name within
      // the same category (backend enforces this per your API doc).
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <div className="p-6 text-muted-foreground">Loading specification...</div>;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {isEdit ? "Edit Specification" : "New Specification"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => {
                // Convert both sides to String to avoid string vs number matching bugs
                const selectedCategory = categories.find(
                  (c) => String(c.id) === String(field.value)
                );

                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {/* Explicitly control what gets shown in the trigger */}
                            {selectedCategory?.name ?? "Select a category"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Names must be unique per category — "RAM" can exist once
                      in "Laptop" and once in "Phone", but not twice in "Laptop".
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (internal key)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ram" {...field} />
                  </FormControl>
                  <FormDescription>
                    Backend trims and collapses whitespace automatically.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. RAM" {...field} />
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
                    <Textarea placeholder="e.g. Installed system memory" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specificationDataTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. GB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Enter RAM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 rounded-md border p-4">
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Required</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filterable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Filterable</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="searchable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Searchable</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/admin/specifications")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Specification"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default AdminSpecificationForm;