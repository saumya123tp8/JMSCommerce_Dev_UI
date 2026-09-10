import { useCallback, useEffect, useState } from "react";
import { getAllOrderReportsAdmin } from "@/Service/OrderReportServices";
import type { AdminOrderReportSummary, OrderReportStatus } from "@/types/orderReport";

export function useAdminOrderReports(statusFilter: OrderReportStatus | "ALL") {
  const [reports, setReports] = useState<AdminOrderReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrderReportsAdmin(
        statusFilter === "ALL" ? undefined : statusFilter
      );
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  return { reports, loading, error, refetch: fetch };
}