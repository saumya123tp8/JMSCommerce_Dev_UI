import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";
import { sortCategoryTree } from "@/lib/categoryUtils";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const { categories, loading, error, refetch } = useCategories();
  const sortedCategories = sortCategoryTree(categories);

  return (
    // <Layout title="Admin Dashboard">
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
              Admin
            </p>
            <h1 className="font-serif text-3xl text-[#2E1F14]">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard/admin/specifications"
              className={buttonVariants({ variant: "outline" })}
            >
              Manage Specifications
            </Link>
            <Link
              to="/dashboard/admin/create-category"
              className={buttonVariants()}
            >
              Create category
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#2E1F14]">Categories</h2>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading categories...</p>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && sortedCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No categories yet. Create your first category to get started.
            </p>
          )}

          {!loading && sortedCategories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0] text-muted-foreground">
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Slug</th>
                    <th className="px-3 py-3 font-medium">Level</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-[#E8DDD0]/70 last:border-b-0"
                    >
                      <td className="px-3 py-3">
                        <span
                          style={{ paddingLeft: `${(category.level - 1) * 16}px` }}
                          className="inline-block"
                        >
                          {category.level > 1 && "— "}
                          {category.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {category.slug}
                      </td>
                      <td className="px-3 py-3">{category.level}</td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={
                            category.status === "ACTIVE" ? "default" : "secondary"
                          }
                        >
                          {category.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/dashboard/admin/create-category?parentId=${category.id}`}
                            className={cn(
                              buttonVariants({ variant: "link" }),
                              "h-auto p-0",
                            )}
                          >
                            Add sub
                          </Link>
                          <Link
                            to={`/dashboard/admin/category/${category.id}`}
                            className={cn(
                              buttonVariants({ variant: "link" }),
                              "h-auto p-0",
                            )}
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    // </Layout>
  );
};

export default AdminDashboard;