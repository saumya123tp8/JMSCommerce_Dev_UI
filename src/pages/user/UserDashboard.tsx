import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useMyOrders } from "@/hooks/useMyOrders";
import { useAddresses } from "@/hooks/useAddresses";
import { useMyOrderReports } from "@/hooks/useMyOrderReports";
import { formatAddress } from "@/lib/orderUtils";
import { reportReasonLabels, reportStatusBadgeVariant } from "@/lib/orderReportUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package, MapPin, User, Trash2, Star, Plus, Pencil, MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Address } from "@/types/address";
import type { AddressFormData } from "@/schema/addressSchema";
import { createAddress, updateAddress } from "@/Service/AddressServices";
import AddressForm from "../address/AddressForm";
import OrderTracker from "@/components/user/OrderTracker";
import ProfileTab from "@/components/user/ProfileTab";
import ReportIssueDialog from "@/components/user/ReportIssueDialog";
import OrderReviewDialog from "@/components/user/OrderReviewDialog";
import { Star as StarIcon, Flag, Eye } from "lucide-react"; // add to existing lucide import line
import type { Order } from "@/types/order";
import toast from "react-hot-toast";

type Tab = "orders" | "addresses" | "reports" | "profile";

const UserDashboard: React.FC = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("orders");

  const { orders, loading: ordersLoading, error: ordersError } = useMyOrders();
  const { addresses, loading: addressesLoading, remove, makeDefault, refetch: refetchAddresses } = useAddresses();
  const { reports, loading: reportsLoading } = useMyOrderReports();

  // New state, alongside existing address/tab state
  const [reportOrder, setReportOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "reports", label: "Reports", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  // Only set when this dashboard was opened FROM another flow (e.g.
  // checkout, "add an address to continue") that expects to be
  // returned to after saving. Undefined in the normal case of just
  // managing addresses from the account page.
  const returnTo = location.state?.from as string | undefined;

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleCancelAddressForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleAddressSubmit = async (formData: AddressFormData) => {
    try {
      setAddressSaving(true);

      const payload = {
        ...formData,
        countryCode: formData.countryCode ?? null,
        apartment: formData.apartment ?? null,
        landmark: formData.landmark ?? null,
        deliveryInstructions: formData.deliveryInstructions ?? null,
      };

      if (editingAddress) {
        await updateAddress(editingAddress.id, payload);
      } else {
        await createAddress(payload);
      }

      setEditingAddress(null);
      setShowAddressForm(false);

      // Refresh the list so the new/edited address shows immediately.
      await refetchAddresses();

      // Only navigate away if we were explicitly opened from another
      // flow (e.g. checkout sent us here to add an address). Otherwise
      // stay put — this is just the account page's Addresses tab.
      if (returnTo) {
        navigate(returnTo);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setAddressSaving(false);
    }
  };

  return (
    <Layout title="My Account">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl text-[#2E1F14]">My Account</h1>

        <div className="flex flex-col gap-6 md:flex-row">
          <nav className="grid w-full grid-cols-4 gap-1 md:flex md:w-32 md:flex-col">
            {tabs.map((t) => {
              const Icon = t.icon;

              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex min-w-0 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs font-medium md:justify-start md:gap-2 md:px-3 md:text-sm",
                    tab === t.id
                      ? "bg-[#2E1F14] text-white"
                      : "text-[#5C4A3A] hover:bg-[#F3EAE0]"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="min-w-0 flex-1">
            {tab === "orders" && (
              <div className="space-y-3">
                {ordersError && (
                  <p className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                    {ordersError}
                  </p>
                )}
                {ordersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  <>
                    {orders.map((order) => (
                      <div key={order.id} className="min-w-0 rounded-xl border border-[#E8DDD0] bg-white p-4">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/user/orders/${order.id}`)}
                            className="min-w-0 truncate font-mono text-sm underline"
                            title={order.orderNumber}
                          >
                            {order.orderNumber}
                          </button>
                          <div className="flex shrink-0 gap-2">
                            <Badge>{order.orderStatus}</Badge>
                            <Badge variant="secondary">{order.paymentStatus}</Badge>
                          </div>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} · ₹{order.grandTotal.toFixed(2)}
                        </p>
                        <OrderTracker status={order.orderStatus} />

                        {/* Per-order actions */}
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E8DDD0] pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-w-0"
                            disabled={order.orderStatus === "CANCELLED"}
                            onClick={() => setReportOrder(order)}
                          >
                            <Flag className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Report</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-w-0"
                            disabled={order.orderStatus !== "DELIVERED"}
                            onClick={() => setReviewOrder(order)}
                          >
                            <StarIcon className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Review</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-w-0"
                            onClick={() => navigate(`/dashboard/user/orders/${order.id}`)}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Details</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {reportOrder && (
                      <ReportIssueDialog
                        orderId={reportOrder.id}
                        orderNumber={reportOrder.orderNumber}
                        open={Boolean(reportOrder)}
                        onOpenChange={(open) => !open && setReportOrder(null)}
                        onSubmitted={() => toast.success("We'll get back to you shortly")}
                      />
                    )}

                    {reviewOrder && (
                      <OrderReviewDialog
                        order={reviewOrder}
                        open={Boolean(reviewOrder)}
                        onOpenChange={(open) => !open && setReviewOrder(null)}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {tab === "reports" && (
              <div className="space-y-3">
                {reportsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading reports...</p>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reports filed yet.</p>
                ) : (
                  reports.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/dashboard/user/reports/${r.id}`)}
                      className="block w-full min-w-0 rounded-xl border border-[#E8DDD0] bg-white p-4 text-left hover:bg-[#F3EAE0]"
                    >
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                          {r.orderNumber}
                        </span>
                        <Badge variant={reportStatusBadgeVariant(r.status)} className="shrink-0">
                          {r.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="truncate font-medium text-[#2E1F14]">{reportReasonLabels[r.reason]}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}

            {tab === "addresses" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-[#2E1F14]">My Addresses</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage your delivery addresses.</p>
                  </div>
                  {!showAddressForm && (
                    <Button onClick={handleAddAddress} className="shrink-0">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  )}
                </div>

                {showAddressForm && (
                  <AddressForm
                    address={editingAddress}
                    onSubmit={handleAddressSubmit}
                    onCancel={handleCancelAddressForm}
                    loading={addressSaving}
                  />
                )}

                {!showAddressForm && (
                  <>
                    {addressesLoading ? (
                      <p className="text-sm text-muted-foreground">Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                      <div className="rounded-xl border border-[#E8DDD0] bg-white p-8 text-center">
                        <MapPin className="mx-auto mb-3 h-8 w-8 text-[#5C4A3A]" />
                        <h3 className="font-semibold text-[#2E1F14]">No saved addresses</h3>
                        <p className="mt-1 mb-4 text-sm text-muted-foreground">
                          Add an address to make checkout faster.
                        </p>
                        <Button onClick={handleAddAddress}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="min-w-0 rounded-xl border border-[#E8DDD0] bg-white p-4">
                            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#2E1F14]">{addr.receiverName}</p>
                                <Badge variant="secondary" className="mt-1">{addr.type}</Badge>
                              </div>
                              {addr.defaultAddress && <Badge className="shrink-0">Default</Badge>}
                            </div>

                            <p className="text-sm text-muted-foreground">{formatAddress(addr)}</p>

                            <p className="mt-2 text-sm text-muted-foreground">
                              {addr.countryCode && `${addr.countryCode} `}
                              {addr.receiverPhone}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {!addr.defaultAddress && (
                                <Button size="sm" variant="ghost" onClick={() => makeDefault(addr.id)}>
                                  <Star className="mr-1 h-3 w-3" />
                                  Make default
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => handleEditAddress(addr)}>
                                <Pencil className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => remove(addr.id)}>
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {tab === "profile" && <ProfileTab />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;