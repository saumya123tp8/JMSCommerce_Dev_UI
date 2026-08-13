import { useCallback, useEffect, useState } from "react";
import { getAllCategories } from "@/Service/CategoryServices";
import { getActiveCategories } from "@/lib/categoryUtils";
import type { Category } from "@/types/category";

interface UseCategoriesOptions {
  activeOnly?: boolean;
  enabled?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { activeOnly = false, enabled = true } = options;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategories(activeOnly ? getActiveCategories(data) : data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load categories";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    if (!enabled) return;
    fetchCategories();
  }, [enabled, fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
