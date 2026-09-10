import { useCallback, useEffect, useState } from "react";
import { getMyOrderReports } from "@/Service/OrderReportServices";
import type { OrderReportSummary } from "@/types/orderReport";

export function useMyOrderReports() {
  const [reports, setReports] = useState<OrderReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setReports(await getMyOrderReports());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { reports, loading, error, refetch: fetch };
}