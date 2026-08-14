import { useMemo } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useSpecifications } from "@/hooks/useSpecifications";
import { getInheritedSpecifications } from "@/lib/specificationUtils";

export function useInheritedSpecifications(categoryId: number | undefined) {
  const { categories } = useCategories();
  const { specifications, loading, error } = useSpecifications();

  const inherited = useMemo(() => {
    if (!categoryId) return [];
    return getInheritedSpecifications(categories, specifications, categoryId);
  }, [categories, specifications, categoryId]);

  return { specifications: inherited, loading, error };
}