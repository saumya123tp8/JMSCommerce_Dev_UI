import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

// Forward-only fulfillment path, plus CANCELLED reachable from any
// pre-delivery state. Adjust once backend confirms exact allowed
// transitions — this is a sensible default, not a documented rule.
const FORWARD_PATH: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const getAllowedNextStatuses = (current: OrderStatus): OrderStatus[] => {
  if (current === "DELIVERED" || current === "CANCELLED") return [];

  const idx = FORWARD_PATH.indexOf(current);
  const next: OrderStatus[] = [];

  if (idx !== -1 && idx + 1 < FORWARD_PATH.length) {
    next.push(FORWARD_PATH[idx + 1]);
  }
  next.push("CANCELLED");

  return next;
};

// Statuses where shipping/confirming an order with unpaid/failed
// payment is worth a specific warning before the admin commits.
const FULFILLMENT_STATUSES: OrderStatus[] = [
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const needsPaymentWarning = (
  targetStatus: OrderStatus,
  paymentStatus: PaymentStatus
): boolean =>
  FULFILLMENT_STATUSES.includes(targetStatus) && paymentStatus !== "SUCCESS";

export const orderStatusBadgeVariant = (
  status: OrderStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "PENDING":
      return "outline";
    default:
      return "secondary";
  }
};

export const paymentStatusBadgeVariant = (
  status: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "SUCCESS":
      return "default";
    case "FAILED":
      return "destructive";
    case "REFUNDED":
      return "outline";
    default:
      return "secondary";
  }
};

export const groupOrdersByUser = (
  orders: Order[]
): Map<number, { userName: string; userEmail: string; orders: Order[] }> => {
  const map = new Map<number, { userName: string; userEmail: string; orders: Order[] }>();
  orders.forEach((order) => {
    if (!map.has(order.userId)) {
      map.set(order.userId, {
        userName: order.userName,
        userEmail: order.userEmail,
        orders: [],
      });
    }
    map.get(order.userId)!.orders.push(order);
  });
  return map;
};

export const filterOrdersByStatus = (
  orders: Order[],
  status: OrderStatus | "ALL"
): Order[] => (status === "ALL" ? orders : orders.filter((o) => o.orderStatus === status));

// Text search across order number, receiver name, and address
  // fields — used for the new address/order-number filter input.
  export const searchOrders = (orders: Order[], query: string): Order[] => {
    if (!query.trim()) return orders;
    const q = query.trim().toLowerCase();
  
    return orders.filter((o) => {
      const addr = o.deliveryAddress;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        addr.receiverName.toLowerCase().includes(q) ||
        addr.city.toLowerCase().includes(q) ||
        addr.state.toLowerCase().includes(q) ||
        addr.pincode.includes(q) ||
        addr.street.toLowerCase().includes(q)
      );
    });
  };
  
  export const formatAddress = (addr: Order["deliveryAddress"]): string =>
    [
      addr.houseNumber,
      addr.apartment,
      addr.street,
      addr.landmark,
      addr.city,
      addr.state,
      addr.pincode,
    ]
      .filter(Boolean)
      .join(", ");


// Exact match — same building/pincode. Cheapest, most precise.
export const groupOrdersByPincode = (orders: Order[]): Map<string, Order[]> => {
  const map = new Map<string, Order[]>();
  orders.forEach((o) => {
    const key = o.deliveryAddress.pincode;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(o);
  });
  return map;
};

// "Nearby" without coordinates: same pincode + street counts as
// closest match, same city is the looser fallback. This is a
// reasonable proxy until lat/lng exists on addresses — worth
// replacing with real radius search once that's added.
export const findNearbyOrders = (orders: Order[], target: Order): Order[] => {
  const addr = target.deliveryAddress;
  return orders.filter((o) => {
    if (o.id === target.id) return false;
    const a = o.deliveryAddress;
    return (
      a.pincode === addr.pincode &&
      (a.street.trim().toLowerCase() === addr.street.trim().toLowerCase() ||
        a.city.trim().toLowerCase() === addr.city.trim().toLowerCase())
    );
  });
};

export const ordersInCity = (orders: Order[], city: string): Order[] =>
  orders.filter(
    (o) => o.deliveryAddress.city.trim().toLowerCase() === city.trim().toLowerCase()
  );


  export const canRefund = (order: Order): boolean =>
    order.orderStatus === "CANCELLED" && order.paymentStatus === "SUCCESS";

 

  