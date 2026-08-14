import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "@/Service/CategoryServices";
import { getDescendantIds, sortCategoryTree } from "@/lib/categoryUtils";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryFormData,
  type UpdateCategoryFormData,
} from "@/schema/categorySchema";
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

const AdminCategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { categories, refetch: refetchCategories } = useCategories();
  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  // Check if parentId is passed via URL query params
  const urlParentId = searchParams.get("parentId");
  const isParentDisabled = Boolean(urlParentId);
  const form = useForm<CreateCategoryFormData | UpdateCategoryFormData>({
    resolver: zodResolver(isEdit ? updateCategorySchema : createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: searchParams.get("parentId")
        ? Number(searchParams.get("parentId"))
        : -1,
      ...(isEdit ? { status: "ACTIVE" as const } : {}),
    },
  });

  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const category = await getCategoryById(Number(id));
        form.reset({
          name: category.name,
          description: category.description ?? "",
          parentId: category.parentId ? Number(category.parentId) : -1,
          status: category.status,
        });
      } catch {
        toast.error("Failed to load category");
        navigate("/dashboard/admin/categories");
      } finally {
        setLoadingInitial(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // Exclude the category itself and its descendants from the parent
  // picker — selecting one would create a circular hierarchy.
  const parentOptions = useMemo(() => {
    if (!isEdit || !id) return sortCategoryTree(categories);
    const selfId = Number(id);
    const blocked = new Set([selfId, ...getDescendantIds(categories, selfId)]);
    return sortCategoryTree(categories).filter((c) => !blocked.has(c.id));
  }, [categories, id, isEdit]);

  const onSubmit = async (
    values: CreateCategoryFormData | UpdateCategoryFormData
  ) => {
    setSubmitting(true);
    try {
      if (isEdit && id) {
        await updateCategory(Number(id), values as UpdateCategoryFormData);
        toast.success("Category updated");
      } else {
        await createCategory(values as CreateCategoryFormData);
        toast.success("Category created");
      }
      await refetchCategories();
      navigate("/dashboard/admin/categories");
    } catch (err: any) {
      // Backend rejects duplicate names, invalid parents, and
      // max-inheritance-level violations here — surface it directly.
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
    return <div className="p-6 text-muted-foreground">Loading category...</div>;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          {isEdit ? "Edit Category" : "New Category"}
        </h1>

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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? undefined : Number(val))
                  }
                  value={field. ? String(field.name) : "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="None (root category)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None (root category)</SelectItem>
                    {parentOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {"— ".repeat(c.level - 1)}
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Leave empty to create a top-level category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => {
                // 1. Find the selected category object by ID
                const selectedCategory = categories.find(
                  (c) => Number(c.id) === Number(field.value)
                );

                return (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      disabled={isParentDisabled} // Disables dropdown if parentId is in URL
                      onValueChange={(val) =>
                        field.onChange(val === "none" ? undefined : Number(val))
                      }
                      value={
                        field.value && field.value !== -1
                          ? String(field.value)
                          : "none"
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (root category)">
                            {/* 2. Display the category NAME when selected */}
                            {selectedCategory
                              ? selectedCategory.name
                              : "None (root category)"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (root category)</SelectItem>
                        {parentOptions.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {"— ".repeat(c.level - 1)}
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {isParentDisabled
                        ? "Parent category was set automatically from URL."
                        : "Leave empty to create a top-level category."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Inactive categories are hidden from customers.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "ACTIVE"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "ACTIVE" : "INACTIVE")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/admin/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default AdminCategoryForm;