import { useMemo, useState } from "react";

export function usePagedList<T>(items: T[], pageSize = 12) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;

  const loadMore = () => setVisibleCount((c) => c + pageSize);

  // Reset when the underlying list changes (e.g. category switched)
  const reset = () => setVisibleCount(pageSize);

  return { visibleItems, hasMore, loadMore, reset };
}