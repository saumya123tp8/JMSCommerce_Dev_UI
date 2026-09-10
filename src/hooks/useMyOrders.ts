// ASSUMPTION: no "get my orders" endpoint is documented anywhere in
// your API docs — only admin-all, by-user/{id}, and by-status exist.
// This guesses a conventional path. CONFIRM with backend before
// relying on this; if wrong, only this one endpoint call needs
// fixing.
import { useCallback, useEffect, useState } from "react";
import ApiClient from "@/Config/ApiCleint";
import type { ApiResponse } from "@/types/apiResponses";
import type { Order } from "@/types/order";

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ApiClient.get<ApiResponse<Order[]>>("/order");
      setOrders(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}