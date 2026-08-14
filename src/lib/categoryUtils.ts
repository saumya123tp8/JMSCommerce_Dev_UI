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


// Orders categories so children appear right after their parent,
// using the backend's own `level` field for indentation in the UI.
export const sortCategoryTree = (categories: Category[]): Category[] => {
  const byParent = new Map<number | null, Category[]>();
  categories.forEach((c) => {
    const key = c.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  });

  const result: Category[] = [];
  const walk = (parentId: number | null) => {
    (byParent.get(parentId) ?? []).forEach((child) => {
      result.push(child);
      walk(child.id);
    });
  };
  walk(null);
  return result;
};

// Prevents picking a category's own descendant as its new parent
// when editing — that would create a circular hierarchy.
export const getDescendantIds = (
  categories: Category[],
  categoryId: number
): number[] => {
  const children = categories.filter((c) => c.parentId === categoryId);
  return children.reduce<number[]>(
    (acc, child) => [
      ...acc,
      child.id,
      ...getDescendantIds(categories, child.id),
    ],
    []
  );
};
