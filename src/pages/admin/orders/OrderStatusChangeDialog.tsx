import { useState } from "react";
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
import { needsPaymentWarning } from "@/lib/orderUtils";
import type { Order, OrderStatus } from "@/types/order";
import { AlertTriangle } from "lucide-react";

interface Props {
  order: Order;
  targetStatus: OrderStatus | null;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

const OrderStatusChangeDialog: React.FC<Props> = ({
  order,
  targetStatus,
  onConfirm,
  onOpenChange,
}) => {
  if (!targetStatus) return null;

  const showPaymentWarning = needsPaymentWarning(targetStatus, order.paymentStatus);

  return (
    <AlertDialog open={Boolean(targetStatus)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Change order #{order.id} to {targetStatus}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3">
              <p>
                This updates the order status for {order.userName} (
                {order.userEmail}).
              </p>
              {showPaymentWarning && (
                <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-medium">
                      Payment status is {order.paymentStatus}, not SUCCESS.
                    </p>
                    <p className="text-sm">
                      Moving this order to {targetStatus} usually means it's
                      being fulfilled — double check the payment before
                      continuing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {showPaymentWarning ? "Proceed anyway" : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderStatusChangeDialog;