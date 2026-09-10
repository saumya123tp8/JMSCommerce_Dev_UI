// lib/cartOptionsTracker.ts
//
// Cart API's PUT /cart/items/{cartItemId} requires
// customizationOptionIds in the request body, defaulting to []
// when the field is omitted — but CartResponseDTO's read model
// (selectedCustomizations) only returns display names, never the
// original option ids. That means a naive quantity-only update
// could silently strip a line item's customizations server-side.
//
// This module tracks {cartItemId: optionIds} locally for items
// added through this app, so a later quantity change can resend
// the same ids. If an item's ids aren't known locally (different
// session/device, or storage was cleared), callers should fall
// back to "remove and re-add" rather than risk a silent data loss.
//
// This is a workaround, not the correct long-term fix. The cleaner
// fix belongs in the backend: either add customizationOptionIds to
// CartResponseDTO's item shape alongside selectedCustomizations, or
// have PUT preserve existing customizations when the field is
// omitted from the request. Once either ships, this file can be
// deleted along with its call sites in QuickAddDialog.tsx and
// ProductDetailPage.tsx.

const STORAGE_KEY = "cart_item_option_ids";

type OptionIdStore = Record<string, number[]>;

const readStore = (): OptionIdStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // Corrupted or inaccessible storage — treat as empty rather
    // than throwing, since this is a best-effort convenience layer.
    return {};
  }
};

const writeStore = (store: OptionIdStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable (e.g. private browsing in some
    // browsers) — silently no-op. Callers already handle a null
    // lookup result by falling back to remove-and-re-add.
  }
};

/**
 * Remembers which customization option ids were sent when a cart
 * item was created, keyed by the cart-item id returned by the API.
 */
export const rememberOptionIds = (cartItemId: string, optionIds: number[]): void => {
  const store = readStore();
  store[cartItemId] = optionIds;
  writeStore(store);
};

/**
 * Returns the remembered option ids for a cart item, or null if
 * none are known (item wasn't added on this device/session, or
 * storage was cleared). Callers should treat null as "can't safely
 * update quantity — remove and re-add instead."
 */
export const getRememberedOptionIds = (cartItemId: string): number[] | null => {
  const store = readStore();
  return store[cartItemId] ?? null;
};

/**
 * Clears the remembered option ids for a cart item — call this
 * whenever the item is removed from the cart, so stale entries
 * don't accumulate in storage indefinitely.
 */
export const forgetOptionIds = (cartItemId: string): void => {
  const store = readStore();
  delete store[cartItemId];
  writeStore(store);
};

/**
 * Clears all remembered option ids — useful on logout or "clear
 * cart", so one user's tracked ids don't leak into another user's
 * session on a shared device.
 */
export const clearAllRememberedOptionIds = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op, same rationale as writeStore
  }
};