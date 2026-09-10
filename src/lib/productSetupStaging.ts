// lib/productSetupStaging.ts

// WORKAROUND, not a real fix: the backend has no field to persist
// "customizations for a product that isn't ACTIVE yet." Per your
// Customization API doc, POST /products/{id}/customizations
// requires the product to already be ACTIVE — but a newly created
// product starts DRAFT and only becomes ACTIVE once its first
// variant exists (exact trigger mechanism still unconfirmed per
// that doc's own TODO list).
//
// So when an admin defines customization groups during product
// creation (before any variant exists), there's nowhere on the
// server to actually save them yet. This stages that data in
// sessionStorage, keyed by product id, so AdminVariantForm can pick
// it up and submit it automatically right after the first variant
// is created (the point at which the product becomes ACTIVE).
//
// Known limitations:
// - Does NOT survive a page refresh (sessionStorage, not
//   persistent storage) — if the admin navigates away and comes
//   back later, the staged data is gone and they'd need to use the
//   "Manage Customizations" page instead.
// - Local to this browser tab/session only — not visible to another
//   admin, another device, or another tab.
// - This is a stopgap. The durable fix is either relaxing the
//   backend's ACTIVE requirement for customization creation, or
//   adding a proper draft/staging concept server-side.
import type { CustomizationRequest } from "@/types/customization";

const storageKey = (productId: number) => `staged_customizations_${productId}`;

export const stageCustomizations = (
  productId: number,
  data: CustomizationRequest
): void => {
  try {
    sessionStorage.setItem(storageKey(productId), JSON.stringify(data));
  } catch {
    // sessionStorage can fail in some environments (private
    // browsing quota limits, etc.) — fail silently rather than
    // crash the product-creation flow over a non-critical staging
    // step. The admin can still add customizations later via the
    // "Manage Customizations" page.
  }
};

export const getStagedCustomizations = (
  productId: number
): CustomizationRequest | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(productId));
    return raw ? (JSON.parse(raw) as CustomizationRequest) : null;
  } catch {
    return null;
  }
};

export const clearStagedCustomizations = (productId: number): void => {
  try {
    sessionStorage.removeItem(storageKey(productId));
  } catch {
    // no-op — nothing meaningful to recover from here
  }
};