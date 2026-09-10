import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { getOrderById } from "@/Service/OrderSevices";
import { formatAddress } from "@/lib/orderUtils";
import OrderTracker from "@/components/user/OrderTracker";
import ReportIssueDialog from "@/components/user/ReportIssueDialog";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flag } from "lucide-react";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(Number(id)).then(setOrder).catch(() => toast.error("Failed to load order")).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Layout title="Order Details"><div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading order...</div></Layout>;
  }
  if (!order) return null;

  const canReport = order.orderStatus !== "CANCELLED";

  return (
    <Layout title={`Order ${order.orderNumber}`}>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/dashboard/user")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
        </Button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-lg text-[#2E1F14]">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Badge>{order.orderStatus}</Badge>
            <Badge variant="secondary">{order.paymentStatus}</Badge>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-[#E8DDD0] bg-white p-5">
          <OrderTracker status={order.orderStatus} />
        </div>

        <div className="mb-6 space-y-3">
          {order.orderItems.map((item, idx) => (
            <div key={`${item.variantId}-${idx}`} className="flex items-center gap-4 rounded-xl border border-[#E8DDD0] bg-white p-4">
              <img src={item.productImage} alt={item.productName} className="h-16 w-16 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#2E1F14]">{item.productName}</p>
                <p className="text-sm text-muted-foreground">{item.variantName} · Qty {item.quantity}</p>
                {item.customizations.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">{item.customizations.map((c) => c.name).join(", ")}</p>
                )}
              </div>
              <p className="font-medium text-[#2E1F14]">₹{item.subTotal.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-xl border border-[#E8DDD0] bg-white p-5">
          <p className="mb-2 text-sm font-medium text-[#2E1F14]">Delivery Address</p>
          <p className="text-sm text-muted-foreground">{order.deliveryAddress.receiverName} · {order.deliveryAddress.receiverPhone}</p>
          <p className="text-sm text-muted-foreground">{formatAddress(order.deliveryAddress)}</p>
        </div>

        <div className="mb-8 rounded-xl border border-[#E8DDD0] bg-white p-5">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>−₹{order.discount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₹{order.deliveryCharge.toFixed(2)}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>₹{order.grandTotal.toFixed(2)}</span></div>
          </div>
        </div>

        {canReport && (
          <Button variant="outline" onClick={() => setReportOpen(true)}>
            <Flag className="mr-2 h-4 w-4" /> Report an Issue
          </Button>
        )}

        <ReportIssueDialog orderId={order.id} orderNumber={order.orderNumber} open={reportOpen} onOpenChange={setReportOpen}
          onSubmitted={() => toast.success("We'll get back to you shortly")} />
      </div>
    </Layout>
  );
};

export default OrderDetailPage;