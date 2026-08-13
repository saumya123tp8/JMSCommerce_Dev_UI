import type { Category, CategoryTreeNode } from "@/types/category";

export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const nodes = new Map<number, CategoryTreeNode>();

  categories.forEach((category) => {
    nodes.set(category.id, { ...category, children: [] });
  });

  const roots: CategoryTreeNode[] = [];

  categories.forEach((category) => {
    const node = nodes.get(category.id);
    if (!node) return;

    if (category.parentId == null) {
      roots.push(node);
      return;
    }

    nodes.get(category.parentId)?.children.push(node);
  });

  return roots;
}

export function getActiveCategories(categories: Category[]): Category[] {
  return categories.filter((category) => category.status === "ACTIVE");
}

export function findCategoryBySlug(
  categories: Category[],
  slug: string,
): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getParentOptions(
  categories: Category[],
  excludeId?: number,
): Category[] {
  return categories.filter((category) => category.id !== excludeId);
}
