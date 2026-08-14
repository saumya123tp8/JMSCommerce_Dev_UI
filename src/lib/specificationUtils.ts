import type { Specification } from "@/types/specification";
import type { Category } from "@/types/category";
// Client-side filter — see note below on the missing
// GET /api/v1/specifications/category/{categoryId} endpoint.
export const getSpecificationsByCategory = (
  specifications: Specification[],
  categoryId: number
): Specification[] =>
  specifications
    .filter((s) => s.categoryId === categoryId)
    .sort((a, b) => a.displayOrder - b.displayOrder);

// Walks a category's parentId chain (including itself) and returns
// every specification whose categoryId matches any ancestor.
// This mirrors the backend's `fetchAllSpecificationsThroughParent`
// behavior client-side, since no dedicated endpoint is documented
// yet (see API doc TODOs). Replace with a direct API call once
// that endpoint exists — this approach requires the full
// categories + specifications lists to already be loaded.
export const getInheritedSpecifications = (
  categories: Category[],
  specifications: Specification[],
  categoryId: number
): Specification[] => {
  const chain: number[] = [];
  let current = categories.find((c) => c.id === categoryId);

  while (current) {
    chain.push(current.id);
    current = current.parentId
      ? categories.find((c) => c.id === current!.parentId)
      : undefined;
  }

  return specifications
    .filter((s) => chain.includes(s.categoryId))
    .sort((a, b) => a.displayOrder - b.displayOrder);
};