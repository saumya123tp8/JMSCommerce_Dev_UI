import { useCallback, useEffect, useState } from "react";
import { getAllSpecifications } from "@/Service/SpecificationServices";
import { getSpecificationsByCategory } from "@/lib/specificationUtils";
import type { Specification } from "@/types/specification";

interface UseSpecificationsOptions {
  categoryId?: number;
  enabled?: boolean;
}

export function useSpecifications(options: UseSpecificationsOptions = {}) {
  const { categoryId, enabled = true } = options;
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // NOTE: always fetches ALL specs — there's no server-side
      // category filter endpoint yet. Worth adding on the backend;
      // this will get slower as the specification table grows.
      const data = await getAllSpecifications();
      setSpecifications(
        categoryId ? getSpecificationsByCategory(data, categoryId) : data
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load specifications";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!enabled) return;
    fetchSpecifications();
  }, [enabled, fetchSpecifications]);

  return { specifications, loading, error, refetch: fetchSpecifications };
}