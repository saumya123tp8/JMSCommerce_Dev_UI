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
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Review your order</DialogTitle>
        </DialogHeader>
        <p className="mb-3 text-sm text-muted-foreground">{order.orderNumber}</p>

        {order.orderStatus !== "DELIVERED" ? (
          <p className="text-sm text-muted-foreground">
            You can review items once this order is delivered.
          </p>
        ) : (
          <div className="space-y-3">
            {order.orderItems.map((item, idx) => {
              // REQUIRED BACKEND FIX: OrderItem needs a real id field
              // for review creation to work. Items without one can't
              // be reviewed yet — shown disabled with an explanation
              // rather than silently omitted.
              const orderItemId = item.orderItemId;
              const isSubmitted = orderItemId !== undefined && submittedIds.has(orderItemId);
              const isExpanded = orderItemId !== undefined && expandedItemId === orderItemId;

              return (
                <div key={`${item.variantId}-${idx}`} className="rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#2E1F14]">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                    </div>
                    {orderItemId === undefined ? (
                      <span className="text-xs text-muted-foreground">Not available yet</span>
                    ) : isSubmitted ? (
                      <span className="text-xs font-medium text-green-700">Reviewed ✓</span>
                    ) : (
                      <Button
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
                    <div className="mt-3 space-y-2 border-t pt-3">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setRating(i + 1)}>
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
                      />
                      <Button
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