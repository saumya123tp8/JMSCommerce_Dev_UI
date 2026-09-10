import { useState } from "react";
import toast from "react-hot-toast";
import { useMyOrders } from "@/hooks/useMyOrders";
import { createReview } from "@/Service/ReviewServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  productId: number;
  onSubmitted: () => void;
}

const ReviewForm: React.FC<Props> = ({ productId, onSubmitted }) => {
  const { orders, loading: ordersLoading } = useMyOrders();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedOrderItemKey, setSelectedOrderItemKey] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Purchases of this product that have an id populated — see the
  // flagged gap in types/order.ts. Items without an id can't be
  // reviewed yet.
  const eligibleItems = orders.flatMap((order) =>
    order.orderItems
      .filter((item) => item.productId === productId && item.variantId !== undefined)
      .map((item) => ({ order, item }))
  );

  if (ordersLoading) return <p className="text-sm text-muted-foreground">Checking your orders...</p>;

  if (eligibleItems.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You can write a review after purchasing this product.
      </p>
    );
  }

  const handleSubmit = async () => {
    if (!rating || !title.trim() || !reviewText.trim() || !selectedOrderItemKey) {
      toast.error("Please fill in rating, title, review, and select your order.");
      return;
    }
    const [orderId, orderItemId] = selectedOrderItemKey.split(":").map(Number);

    setSubmitting(true);
    try {
      await createReview(orderId, orderItemId, { rating, title, reviewText });
      toast.success("Review submitted");
      setRating(0);
      setTitle("");
      setReviewText("");
      onSubmitted();
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-[#E8DDD0] p-4">
      <p className="text-sm font-medium text-[#2E1F14]">Write a Review</p>

      {eligibleItems.length > 1 && (
        // <Select value={selectedOrderItemKey} onValueChange={setSelectedOrderItemKey}>
        <Select value={selectedOrderItemKey} onValueChange={(value) => setSelectedOrderItemKey(value || "")}>
          <SelectTrigger>
            <SelectValue placeholder="Which order is this review for?" />
          </SelectTrigger>
          <SelectContent>
            {eligibleItems.map(({ order, item }) => (
              <SelectItem key={`${order.id}:${item.variantId}`} value={`${order.id}:${item.variantId}`}>
                {order.orderNumber} — {item.variantName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {eligibleItems.length === 1 && (
        <input
          type="hidden"
          value={`${eligibleItems[0].order.id}:${eligibleItems[0].item.variantId}`}
          ref={() =>
            setSelectedOrderItemKey(`${eligibleItems[0].order.id}:${eligibleItems[0].item.variantId}`)
          }
        />
      )}

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => setRating(i + 1)}>
            <Star
              className={cn(
                "h-6 w-6",
                i < rating ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#E8DDD0]"
              )}
            />
          </button>
        ))}
      </div>

      <Input placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
      <Textarea
        placeholder="Share your experience..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        maxLength={3000}
      />

      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
};

export default ReviewForm;