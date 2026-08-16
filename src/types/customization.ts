// TODO (per API doc): exact enum values unconfirmed with backend.
export type SelectionType = "SINGLE" | "MULTIPLE";
export type AdjustmentType = "FIXED" | "PERCENTAGE";

export interface CustomizationOption {
  id?: number; // present on read, absent on create payload
  name: string;
  adjustmentType: AdjustmentType;
  adjustmentValue: number;
  displayOrder: number;
}

export interface CustomizationGroup {
  id?: number;
  name: string;
  selectionType: SelectionType;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  displayOrder: number;
  options: CustomizationOption[];
}

export interface CustomizationRequest {
  groups: CustomizationGroup[];
}

// Structure unconfirmed per doc TODO ("Document exact
// CustomizationResponseDTO structure") — assumed to mirror the
// request shape with ids populated, matching the doc's own
// product-level example. Adjust if the real shape differs.
export interface CustomizationResponse {
  productId: number;
  groups: CustomizationGroup[];
}