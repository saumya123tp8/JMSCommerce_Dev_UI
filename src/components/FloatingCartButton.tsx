// src/components/FloatingCartButton.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";


import "./FloatingCartButton.css";

const FloatingCartButton = () => {
   const { cart } = useCart();

  // ⚠️ Assumes cart.items: { quantity: number }[] — confirm against your
  // actual Cart type below.
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const navigate = useNavigate();
  const [bump, setBump] = useState(false);
  const prevCountRef = useRef(0);



  // Trigger bump animation whenever cart count increases
  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prevCountRef.current = itemCount;
      return () => clearTimeout(t);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <button
      className={`fcb${bump ? " fcb--bump" : ""}`}
      onClick={() => navigate("/cart")}
      aria-label={`Go to cart — ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
    >
      {/* Coffee cup SVG icon */}
      <svg
        className="fcb__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>

      {/* Count badge */}
      <span className="fcb__badge" aria-hidden="true">
        {itemCount > 99 ? "99+" : itemCount}
      </span>

      {/* Steam lines — animated */}
      <span className="fcb__steam" aria-hidden="true">
        <span className="fcb__steam-line" />
        <span className="fcb__steam-line" />
        <span className="fcb__steam-line" />
      </span>

      {/* Ripple on bump */}
      {bump && <span className="fcb__ripple" aria-hidden="true" />}
    </button>
  );
};

export default FloatingCartButton;