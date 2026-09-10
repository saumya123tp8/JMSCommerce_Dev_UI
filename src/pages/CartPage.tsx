import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddresses";
import { useAppSelector } from "@/redux/hooks";
import { createOrder } from "@/Service/OrderSevices";
import { initiatePayment, verifyPayment } from "@/Service/PaymentServices";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { extractApiErrorMessage } from "@/lib/apiError";
import { formatAddress } from "@/lib/orderUtils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus, Trash2, MapPin, CreditCard, Truck } from "lucide-react";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const { cart, loading, update, remove } = useCart();
  const { addresses, loading: addressesLoading } = useAddresses();
  const { open: openRazorpay } = useRazorpayCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    addresses.find((a) => a.defaultAddress)?.id ?? null
  );
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [placing, setPlacing] = useState(false);

  if (!auth?.isAuthenticated) {
    return (
      <Layout title="Your Cart">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4 text-muted-foreground">Please log in to view your cart.</p>
          <Button onClick={() => navigate("/login")}>Log In</Button>
        </div>
      </Layout>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacing(true);
    try {
      const order = await createOrder({ addressId: selectedAddressId, paymentMethod });

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully");
        navigate(`/order/${order.id}/success`);
        return;
      }

      // RAZORPAY path
      const init = await initiatePayment(order.id);
      openRazorpay({
        init,
        customerName: auth.user?.name,
        customerEmail: auth.user?.email,
        onSuccess: async (verifyPayload) => {
          try {
            const result = await verifyPayment(verifyPayload);
            if (result.paymentStatus === "SUCCESS") {
              toast.success("Payment successful");
              navigate(`/order/${order.id}/success`);
            } else {
              toast.error("Payment could not be verified");
              navigate(`/order/${order.id}/payment-failed`);
            }
          } catch (err) {
            toast.error(extractApiErrorMessage(err));
            navigate(`/order/${order.id}/payment-failed`);
          }
        },
        onDismiss: () => {
          toast("Payment window closed — you can retry from your order.", { icon: "⚠️" });
          navigate(`/order/${order.id}/payment-failed`);
        },
      });
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Layout title="Your Cart">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl text-[#2E1F14]">Your Cart</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading cart...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DDD0] bg-white p-12 text-center">
            <p className="mb-4 text-muted-foreground">Your cart is empty.</p>
            <Button onClick={() => navigate("/")}>Browse the menu</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-3 lg:col-span-2">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-[#E8DDD0] bg-white p-4"
                >
                  <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#2E1F14]">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    {item.selectedCustomizations.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.selectedCustomizations.join(", ")}
                      </p>
                    )}
                    {!item.available && (
                      <p className="mt-1 text-xs text-destructive">Currently unavailable</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(item.id, { quantity: item.quantity - 1 })}
                      disabled={item.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => update(item.id, { quantity: item.quantity + 1 })}
                      disabled={item.quantity >= item.availableStock}
                      className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="w-20 text-right font-medium text-[#2E1F14]">
                    ₹{item.totalPrice.toFixed(0)}
                  </p>
                  <button onClick={() => remove(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Address selection */}
              <div className="rounded-xl border border-[#E8DDD0] bg-white p-4">
                <p className="mb-3 flex items-center gap-2 font-medium text-[#2E1F14]">
                  <MapPin className="h-4 w-4" /> Delivery Address
                </p>
                {addressesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No saved addresses.{" "}
                    <button onClick={() => navigate("/dashboard/user/")} className="underline">
                      First Add Shipping Address
                    </button>
                  </p>
                ) : (
                  <>
                    {/* <button onClick={() => navigate("/dashboard/user/")} className="underline"> */}
                    <button onClick={() => navigate("/dashboard/user/", {
                      state: {
                        from: "/cart",
                      },
                    })} className="underline">
                      Add new
                    </button>
                    <br></br>
                    <RadioGroup
                      value={selectedAddressId ? String(selectedAddressId) : undefined}
                      onValueChange={(val) => setSelectedAddressId(Number(val))}
                      className="space-y-2"
                    >
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className="flex items-start gap-3 rounded-md border p-3 text-sm has-[:checked]:border-[#2E1F14]"
                        >
                          <RadioGroupItem value={String(addr.id)} className="mt-0.5" />
                          <div>
                            <p className="font-medium text-[#2E1F14]">
                              {addr.receiverName}{" "}
                              {addr.defaultAddress && (
                                <span className="text-xs text-muted-foreground">(Default)</span>
                              )}
                            </p>
                            <p className="text-muted-foreground">{formatAddress(addr as any)}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </>
                )}
              </div>

              {/* Payment method */}
              <div className="rounded-xl border border-[#E8DDD0] bg-white p-4">
                <p className="mb-3 flex items-center gap-2 font-medium text-[#2E1F14]">
                  <CreditCard className="h-4 w-4" /> Payment Method
                </p>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as "RAZORPAY" | "COD")}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:border-[#2E1F14]">
                    <RadioGroupItem value="RAZORPAY" />
                    Pay online (Razorpay)
                  </label>
                  <label className="flex items-center gap-3 rounded-md border p-3 text-sm has-[:checked]:border-[#2E1F14]">
                    <RadioGroupItem value="COD" />
                    <Truck className="h-4 w-4" /> Cash on Delivery
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Order summary */}
            <div className="h-fit rounded-xl border border-[#E8DDD0] bg-white p-4">
              <p className="mb-3 font-medium text-[#2E1F14]">Order Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>−₹{cart.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₹{cart.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span>₹{cart.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button className="mt-4 w-full" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? "Placing order..." : "Place Order"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;