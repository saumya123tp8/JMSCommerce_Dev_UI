import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/types/review";

const StarRow: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#E8DDD0]"}`}
      />
    ))}
  </div>
);

const ReviewList: React.FC<{ reviews: Review[]; loading: boolean }> = ({ reviews, loading }) => {
  if (loading) return <p className="text-sm text-muted-foreground">Loading reviews...</p>;
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet — be the first.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-lg border border-[#E8DDD0] p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRow rating={r.rating} />
              {r.verifiedPurchase && (
                <Badge variant="secondary" className="text-[10px]">Verified Purchase</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mb-1 font-medium text-[#2E1F14]">{r.title}</p>
          <p className="text-sm text-muted-foreground">{r.reviewText}</p>
          <p className="mt-2 text-xs text-muted-foreground">— {r.reviewerName}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;