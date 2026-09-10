import { useCallback, useRef } from "react";
import type { PaymentInitiationResponse, VerifyPaymentPayload } from "@/types/payment";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

const loadScriptOnce = (() => {
  let promise: Promise<void> | null = null;
  return () => {
    if (promise) return promise;
    promise = new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.body.appendChild(script);
    });
    return promise;
  };
})();

interface OpenOptions {
  init: PaymentInitiationResponse;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (payload: VerifyPaymentPayload) => void;
  onDismiss: () => void;
}

export function useRazorpayCheckout() {
  const openingRef = useRef(false);

  const open = useCallback(async (options: OpenOptions) => {
    if (openingRef.current) return;
    openingRef.current = true;
    try {
      await loadScriptOnce();
      const { init } = options;

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_TRrU2ALLeDRNvP", // public key, safe client-side
        amount: Math.round(init.amount * 100), // Razorpay expects paise
        currency: init.currency,
        order_id: init.razorpayOrderId,
        name: "Ambani Coffee",
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone,
        },
        theme: { color: "#2E1F14" },
        handler: (response: any) => {
          // Per the payment doc's own rule: a successful Checkout
          // callback is NOT proof of payment — it just means
          // Razorpay collected these values. The backend's
          // /payments/verify call is the actual source of truth.
          options.onSuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => options.onDismiss(),
        },
      });

      rzp.open();
    } finally {
      openingRef.current = false;
    }
  }, []);

  return { open };
}