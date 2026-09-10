export interface Review {
    id: number;
    rating: number;
    title: string;
    reviewText: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    reviewerName: string;
    createdAt: string;
  }
  
  export interface CreateReviewPayload {
    rating: number;
    title: string;
    reviewText: string;
  }
  
  export type UpdateReviewPayload = CreateReviewPayload;