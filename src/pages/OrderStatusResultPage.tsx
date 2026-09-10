import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { getOrderById } from "@/Service/OrderSevices";
import { retryPayment, verifyPayment } from "@/Service/PaymentServices";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { extractApiErrorMessage } from "@/lib/apiError";
import { useAppSelector } from "@/redux/hooks";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  variant: "success" | "failed";
}

const OrderStatusResultPage: React.FC<Props> = ({ variant }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);
  const { open: openRazorpay } = useRazorpayCheckout();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(Number(id))
      .then(setOrder)
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRetry = async () => {
    if (!id) return;
    setRetrying(true);
    try {
      const init = await retryPayment(Number(id));
      openRazorpay({
        init,
        customerName: auth?.user?.name,
        customerEmail: auth?.user?.email,
        onSuccess: async (payload) => {
          try {
            const result = await verifyPayment(payload);
            if (result.paymentStatus === "SUCCESS") {
              navigate(`/order/${id}/success`);
            } else {
              toast.error("Payment could not be verified");
            }
          } catch (err) {
            toast.error(extractApiErrorMessage(err));
          }
        },
        onDismiss: () => toast("Payment window closed", { icon: "⚠️" }),
      });
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Layout title={variant === "success" ? "Order Confirmed" : "Payment Failed"}>
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        {variant === "success" ? (
          <CheckCircle2 className="mb-4 h-14 w-14 text-green-600" />
        ) : (
          <XCircle className="mb-4 h-14 w-14 text-destructive" />
        )}

        <h1 className="mb-2 font-serif text-3xl text-[#2E1F14]">
          {variant === "success" ? "Order Confirmed" : "Payment Failed"}
        </h1>

        {loading ? (
          <p className="mb-6 text-muted-foreground">Loading order details...</p>
        ) : order ? (
          <p className="mb-6 text-muted-foreground">
            Order {order.orderNumber} · ₹{order.grandTotal.toFixed(2)}
          </p>
        ) : (
          <p className="mb-6 text-muted-foreground">Order details unavailable.</p>
        )}

        <div className="flex gap-3">
          {variant === "failed" && (
            <Button onClick={handleRetry} disabled={retrying}>
              {retrying ? "Starting..." : "Retry Payment"}
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/dashboard/user")}>
            View My Orders
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderStatusResultPage;