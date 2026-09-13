import type { OrderStatus } from "@/types/order";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { status: OrderStatus }

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "CONFIRMED", label: "Placed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

// PENDING (payment not yet confirmed) shows no completed step.
const statusIndex = (status: OrderStatus): number =>
  status === "PENDING" ? -1 : STEPS.findIndex((s) => s.key === status);

const OrderTracker: React.FC<Props> = ({ status }) => {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = statusIndex(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <div key={step.key} className="flex min-w-0 flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                isDone ? "border-[#2E1F14] bg-[#2E1F14] text-white" : "border-[#E8DDD0] text-muted-foreground")}>
                {isDone ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={cn("mt-1 text-center text-[10px] leading-tight sm:text-xs", isDone ? "text-[#2E1F14]" : "text-muted-foreground")}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", idx < currentIndex ? "bg-[#2E1F14]" : "bg-[#E8DDD0]")} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;