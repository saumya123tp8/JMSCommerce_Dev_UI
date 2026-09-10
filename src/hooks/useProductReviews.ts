import { useCallback, useEffect, useState } from "react";
import { getProductReviews } from "@/Service/ReviewServices";
import type { Review } from "@/types/review";

export function useProductReviews(productId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setReviews(await getProductReviews(productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { reviews, loading, error, refetch: fetch };
}