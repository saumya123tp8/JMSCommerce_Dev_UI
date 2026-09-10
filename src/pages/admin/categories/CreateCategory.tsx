import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCategorySchema } from "@/schema/categorySchema";
import type { CreateCategoryInput,CreateCategoryFormData } from "@/schema/categorySchema";
import { createCategory } from "@/Service/CategoryServices";
import { useCategories } from "@/hooks/useCategories";
import { getParentOptions } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

const CreateCategory = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const parentOptions = getParentOptions(categories);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput, unknown, CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: 0
    },
  });

  const onSubmit = async (data: CreateCategoryFormData) => {
    try {
      const created = await createCategory({
        name: data.name,
        description: data.description || undefined,
        parentId: data.parentId === 0 ? null : data.parentId,
      });

      toast.success("Category created successfully");
      navigate(`/dashboard/admin/category/${created.id}`);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ??
        "Failed to create category";

      toast.error(message);
    }
  };

  return (
    <Layout title="Create Category">
      <section className="container mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
            Admin
          </p>
          <h1 className="font-serif text-3xl text-[#2E1F14]">Create Category</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <Input id="name" placeholder="Cold Coffee" {...register("name")} />
            {errors.name && (
              <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Optional category description"
              {...register("description")}
            />
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
            // CreateCategory.tsx
            <select
              id="parentId"
              defaultValue="0"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("parentId")}
            >
              <option value="0">None (root category)</option>
              {parentOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {"—".repeat(Math.max(category.level - 1, 0))} {category.name}
                </option>
              ))}
            </select>
            {errors.parentId && (
              <p className="mt-2 text-sm text-destructive">
                {errors.parentId.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create category"}
            </Button>
            <Link
              to="/dashboard/admin"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default CreateCategory;
