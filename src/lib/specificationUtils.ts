import type { Specification } from "@/types/specification";

// Client-side filter — see note below on the missing
// GET /api/v1/specifications/category/{categoryId} endpoint.
export const getSpecificationsByCategory = (
  specifications: Specification[],
  categoryId: number
): Specification[] =>
  specifications
    .filter((s) => s.categoryId === categoryId)
    .sort((a, b) => a.displayOrder - b.displayOrder);