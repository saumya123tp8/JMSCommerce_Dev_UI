import { useState } from "react";
import toast from "react-hot-toast";
import { createReview } from "@/Service/ReviewServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Order } from "@/types/order";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Tracks which order item is currently expanded for review, plus
// its in-progress rating/title/text and whether it's already been
// submitted this session (so the form swaps to a "Reviewed" state
// without needing a full order refetch).
const OrderReviewDialog: React.FC<Props> = ({ order, open, onOpenChange }) => {
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<Set<number>>(new Set());

  const resetForm = () => {
    setExpandedItemId(null);
    setRating(0);
    setTitle("");
    setReviewText("");
  };

  const handleSubmit = async (orderItemId: number) => {
    if (!rating || !title.trim() || !reviewText.trim()) {
      toast.error("Please add a rating, title, and review text.");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(order.id, orderItemId, { rating, title, reviewText });
      toast.success("Review submitted");
      setSubmittedIds((prev) => new Set(prev).add(orderItemId));
      resetForm();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-lg sm:text-xl">Review your order</DialogTitle>
          <p className="break-all text-xs text-muted-foreground sm:text-sm">{order.orderNumber}</p>
        </DialogHeader>

        {order.orderStatus !== "DELIVERED" ? (
          <p className="text-sm text-muted-foreground">
            You can review items once this order is delivered.
          </p>
        ) : (
          <div className="space-y-3.5">
            {order.orderItems.map((item, idx) => {
              // REQUIRED BACKEND FIX: OrderItem needs a real id field
              // for review creation to work. Items without one can't
              // be reviewed yet — shown disabled with an explanation
              // rather than silently omitted.
              const orderItemId = item.orderItemId;
              const isSubmitted = orderItemId !== undefined && submittedIds.has(orderItemId);
              const isExpanded = orderItemId !== undefined && expandedItemId === orderItemId;

              return (
                <div key={`${item.variantId}-${idx}`} className="rounded-2xl border border-[#E8DDD0] bg-[#FFFCF9] p-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#2E1F14]">{item.productName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variantName}</p>
                    </div>
                    {orderItemId === undefined ? (
                      <span className="mt-0.5 text-xs text-muted-foreground">Not available yet</span>
                    ) : isSubmitted ? (
                      <span className="text-xs font-medium text-green-700">Reviewed ✓</span>
                    ) : (
                      <Button
                        className="shrink-0"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (isExpanded) {
                            resetForm();
                          } else {
                            resetForm();
                            setExpandedItemId(orderItemId);
                          }
                        }}
                      >
                        {isExpanded ? "Cancel" : "Write review"}
                      </Button>
                    )}
                  </div>

                  {isExpanded && orderItemId !== undefined && (
                    <div className="mt-3 space-y-3 border-t border-[#E8DDD0] pt-3">
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setRating(i + 1)} className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#F3EAE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E1F14]/30" aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}>
                            <Star
                              className={cn(
                                "h-5 w-5",
                                i < rating ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#E8DDD0]"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="Review title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                      />
                      <Textarea
                        placeholder="Share your experience..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        maxLength={3000}
                        className="min-h-28 resize-none"
                      />
                      <Button
                        className="w-full sm:w-auto"
                        size="sm"
                        onClick={() => handleSubmit(orderItemId)}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderReviewDialog;