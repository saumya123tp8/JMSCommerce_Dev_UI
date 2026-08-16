import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/Service/CartServices";
import { extractApiErrorMessage } from "@/lib/apiError";
import type { Cart, AddCartItemPayload, UpdateCartItemPayload } from "@/types/cart";

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCart(await getCart());
    } catch (err) {
      setError(extractApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const add = async (payload: AddCartItemPayload) => {
    try {
      setCart(await addCartItem(payload));
      toast.success("Added to cart");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const update = async (cartItemId: string, payload: UpdateCartItemPayload) => {
    // Per API doc: never send quantity 0 to this endpoint —
    // use removeCartItem instead for that case.
    if (payload.quantity === 0) {
      return remove(cartItemId);
    }
    try {
      setCart(await updateCartItem(cartItemId, payload));
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const remove = async (cartItemId: string) => {
    try {
      setCart(await removeCartItem(cartItemId));
      toast.success("Item removed");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  const clear = async () => {
    try {
      await clearCart();
      setCart(null);
      toast.success("Cart cleared");
    } catch (err) {
      toast.error(extractApiErrorMessage(err));
    }
  };

  return { cart, loading, error, add, update, remove, clear, refetch: fetchCart };
}