import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/Service/OrderSevices";
import {
  filterOrdersByStatus,
  searchOrders,
  formatAddress,
  findNearbyOrders,
  getAllowedNextStatuses,
  orderStatusBadgeVariant,
  paymentStatusBadgeVariant,
  canRefund,
} from "@/lib/orderUtils";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Order, OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, MapPin, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import OrderStatusChangeDialog from "./OrderStatusChangeDialog";

const ALL_STATUSES: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const AdminOrderList: React.FC = () => {
  const { orders, loading, error, setOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Pending status-change confirmation, tracked as
  // { order, targetStatus } so the dialog knows what to confirm.
  const [pendingChange, setPendingChange] = useState<{
    order: Order;
    targetStatus: OrderStatus;
  } | null>(null);

  // Status filter first, then free-text search across order
  // number, customer name, and address fields — chained so both
  // narrow the same result set together.
  const filtered = searchOrders(
    filterOrdersByStatus(orders, statusFilter),
    searchQuery
  );

  const requestStatusChange = (order: Order, targetStatus: OrderStatus) => {
    setPendingChange({ order, targetStatus });
  };

  const confirmStatusChange = async () => {
    if (!pendingChange) return;
    const { order, targetStatus } = pendingChange;
    try {
      const updated = await updateOrderStatus(order.id, targetStatus);
      // setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      if (updated) {
        // Backend returned the updated order — use it directly.
        setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      } else {
        // Backend returned null/no order body — fall back to an
        // optimistic local update instead of corrupting state with
        // null. This assumes the request succeeded since no error
        // was thrown; refetching from the server is the safer
        // long-term fix once the endpoint's real response is confirmed.
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, orderStatus: targetStatus } : o
          )
        );
      }
      toast.success(`Order ${order.orderNumber} moved to ${targetStatus}`);
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setPendingChange(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl text-[#2E1F14]">Orders</h1>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search order #, name, city, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-72"
          />
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as OrderStatus | "ALL")}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "ALL" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const isExpanded = expandedId === order.id;
                const nextStatuses = getAllowedNextStatuses(order.orderStatus);
                const nearby = findNearbyOrders(orders, order);

                return (
                  <>
                    <TableRow key={order.id}>
                      <TableCell>
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : order.id)
                          }
                          className="flex h-5 w-5 items-center justify-center rounded hover:bg-muted"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{order.orderNumber}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.userName}
                        <div className="text-xs text-muted-foreground">
                          {order.userEmail}
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate text-xs text-muted-foreground"
                        title={formatAddress(order.deliveryAddress)}
                      >
                        <div className="flex items-start gap-1">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                          {order.deliveryAddress.city}, {order.deliveryAddress.pincode}
                        </div>
                      </TableCell>
                      <TableCell>₹{order.grandTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={paymentStatusBadgeVariant(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={orderStatusBadgeVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right align-middle">
                        <div className="flex flex-col items-end gap-2">

                          {/* Primary Action: Refund Review */}
                          {canRefund(order) && (
                            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-medium">
                              <Link to={`/dashboard/admin/orders/${order.id}/refund-review`}>
                                <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
                                Review Refund
                              </Link>
                            </Button>
                          )}

                          {/* Secondary Actions: Next Status Transitions */}
                          {nextStatuses.length === 0 ? (
                            <span className="text-xs italic text-muted-foreground">
                              No further updates
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {nextStatuses.map((status) => {
                                const isCancelled = status === "CANCELLED";
                               

                                return (
                                  <Button
                                    key={status}
                                    size="sm"
                                    variant={isCancelled  ? "outline" : "default"}
                                    className={cn(
                                      "h-8 text-xs capitalize tracking-wide transition-colors",
                                      isCancelled &&
                                      "border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      )}
                                    onClick={() => requestStatusChange(order, status)}
                                  >
                                    {status.toLowerCase()}
                                  </Button>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/30">
                          <div className="space-y-3 p-3">
                            {/* Delivery address detail block */}
                            <div className="rounded-md border bg-white p-3">
                              <p className="text-sm font-medium">
                                {order.deliveryAddress.receiverName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.deliveryAddress.receiverPhone}
                              </p>
                              <p className="mt-1 text-sm">
                                {formatAddress(order.deliveryAddress)}
                              </p>
                              {order.deliveryAddress.deliveryInstructions && (
                                <p className="mt-1 text-xs italic text-muted-foreground">
                                  "{order.deliveryAddress.deliveryInstructions}"
                                </p>
                              )}
                              {nearby.length > 0 && (
                                <button
                                  className="mt-2 text-xs text-primary underline"
                                  onClick={() =>
                                    setSearchQuery(order.deliveryAddress.pincode)
                                  }
                                >
                                  {nearby.length} other order(s) near this address
                                </button>
                              )}
                            </div>

                            {order.orderItems.map((item, idx) => (
                              <div
                                key={`${item.variantId}-${idx}`}
                                className="flex items-start gap-3 rounded-md border bg-white p-3"
                              >
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="h-14 w-14 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {item.productName} — {item.variantName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    SKU: {item.sku} · Qty: {item.quantity}
                                  </p>
                                  {item.customizations.length > 0 && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {item.customizations
                                        .map(
                                          (c) =>
                                            `${c.name}${c.priceAdjustment > 0
                                              ? ` (+₹${c.priceAdjustment})`
                                              : ""
                                            }`
                                        )
                                        .join(", ")}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm">
                                  <p>₹{item.subTotal.toFixed(2)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ₹{item.sellingPrice} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pendingChange && (
        <OrderStatusChangeDialog
          order={pendingChange.order}
          targetStatus={pendingChange.targetStatus}
          onConfirm={confirmStatusChange}
          onOpenChange={(open) => !open && setPendingChange(null)}
        />
      )}
    </div>
  );
};

export default AdminOrderList;