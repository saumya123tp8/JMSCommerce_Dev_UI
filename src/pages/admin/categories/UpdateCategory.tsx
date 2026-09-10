import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateCategorySchema, parseParentId } from "@/schema/categorySchema";
import type { UpdateCategoryFormData } from "@/schema/categorySchema";
import {
  getCategoryById,
  updateCategory,
} from "@/Service/CategoryServices";
import { useCategories } from "@/hooks/useCategories";
import { getParentOptions } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

const UpdateCategory = () => {
  const { id } = useParams();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const { categories, refetch } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const parentOptions = getParentOptions(categories, categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
  });

  useEffect(() => {
    if (!categoryId || Number.isNaN(categoryId)) {
      setLoadingCategory(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setLoadingCategory(true);
        const data = await getCategoryById(categoryId);
        setCategory(data);
        reset({
          name: data.name,
          description: data.description ?? "",
          parentId: data.parentId != null ? (data.parentId) : null,
          status: data.status,
        });
      } catch {
        toast.error("Category not found");
        setCategory(null);
      } finally {
        setLoadingCategory(false);
      }
    };

    loadCategory();
  }, [categoryId, reset]);

  const onSubmit = async (data: UpdateCategoryFormData) => {
    if (!categoryId || Number.isNaN(categoryId)) return;

    try {
      await updateCategory(categoryId, {
        name: data.name,
        description: data.description || undefined,
        parentId: (data.parentId),
        status: data.status,
      });
      toast.success("Category updated successfully");
      await refetch();
      navigate("/dashboard/admin");
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? "Failed to update category";
      toast.error(message);
    }
  };

  return (
    <Layout title="Update Category">
      <section className="container mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
            Admin
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl text-[#2E1F14]">
              Update Category
            </h1>
            {category && <Badge variant="secondary">{category.slug}</Badge>}
          </div>
        </div>

        {loadingCategory && (
          <p className="text-muted-foreground">Loading category...</p>
        )}

        {!loadingCategory && !category && (
          <div className="text-center">
            <p className="text-muted-foreground">Category not found.</p>
            <Link
              to="/dashboard/admin"
              className={cn(buttonVariants(), "mt-4 inline-flex")}
            >
              Back to admin
            </Link>
          </div>
        )}

        {category && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <Textarea id="description" rows={4} {...register("description")} />
              {errors.description && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="parentId" className="mb-2 block text-sm font-medium">
                Parent category
              </label>
              // UpdateCategory.tsx — same idea, but defaultValue should reflect
              // the loaded category's actual parentId once available
              <select
                id="parentId"
                defaultValue={category?.parentId != null ? String(category.parentId) : "0"}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("parentId")}
              >
                <option value="0">None (root category)</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {"—".repeat(Math.max(item.level - 1, 0))} {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="mb-2 block text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("status")}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                Deleting categories is not supported by the API. Set status to
                INACTIVE instead.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
              <Link
                to="/dashboard/admin"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </section>
    </Layout>
  );
};

export default UpdateCategory;
