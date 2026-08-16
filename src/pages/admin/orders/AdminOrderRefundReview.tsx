import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderById, decideOrderRefund } from "@/Service/OrderSevices";
import { canRefund, formatAddress } from "@/lib/orderUtils";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

const AdminOrderRefundReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [pendingAction, setPendingAction] = useState<"approve" | "deny" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getOrderById(Number(id));
        setOrder(data);
      } catch (err) {
        toast.error(extractApiErrorMessage(err));
        navigate("/dashboard/admin/orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const submitDecision = async (approve: boolean) => {
    if (!order) return;
    setSubmitting(true);
    try {
      const updated = await decideOrderRefund(order.id, {
        approve,
        reason: reason.trim() || undefined,
      });
      setOrder(updated ?? { ...order, paymentStatus: approve ? "REFUNDED" : order.paymentStatus });
      toast.success(
        approve
          ? `Refund approved for order ${order.orderNumber}`
          : `Refund declined for order ${order.orderNumber}`
      );
      navigate("/dashboard/admin/orders");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
      setPendingAction(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading order...</div>;
  }

  if (!order) return null;

  const eligible = canRefund(order);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/dashboard/admin/orders")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to orders
      </Button>

      <h1 className="mb-1 text-2xl font-bold">Refund Review</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Order {order.orderNumber}
      </p>

      {!eligible && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          This order isn't eligible for refund review — it must be CANCELLED
          with a SUCCESS payment. Current state: {order.orderStatus} /{" "}
          {order.paymentStatus}.
        </div>
      )}

      {/* Order + payment summary */}
      <div className="mb-6 rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium">{order.userName}</p>
          <div className="flex gap-2">
            <Badge variant="destructive">{order.orderStatus}</Badge>
            <Badge>{order.paymentStatus}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{order.userEmail}</p>
        <p className="mt-2 text-sm">{formatAddress(order.deliveryAddress)}</p>

        <div className="mt-4 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>−₹{order.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span>₹{order.deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-medium">
            <span>Refund amount</span>
            <span>₹{order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Order items, for context on what was ordered */}
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium">Items</p>
        {order.orderItems.map((item, idx) => (
          <div
            key={`${item.variantId}-${idx}`}
            className="flex items-center gap-3 rounded-md border p-2 text-sm"
          >
            <img
              src={item.productImage}
              alt={item.productName}
              className="h-10 w-10 rounded object-cover"
            />
            <div className="flex-1">
              {item.productName} — {item.variantName} × {item.quantity}
            </div>
            <div>₹{item.subTotal.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {order.paymentStatus === "REFUNDED" ? (
        <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm text-green-900">
          This order has already been refunded.
        </div>
      ) : (
        eligible && (
          <>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">
                Note (optional)
              </label>
              <Textarea
                placeholder="Reason for approving/declining this refund..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setPendingAction("deny")}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Decline Refund
              </Button>
              <Button onClick={() => setPendingAction("approve")}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approve Refund
              </Button>
            </div>
          </>
        )
      )}

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === "approve"
                ? `Approve refund of ₹${order.grandTotal.toFixed(2)}?`
                : "Decline this refund?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "approve"
                ? "This marks the payment as REFUNDED and should only be confirmed once the money has actually been returned to the customer."
                : "The payment status stays SUCCESS. This decision will be recorded for audit purposes."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => submitDecision(pendingAction === "approve")}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrderRefundReview;