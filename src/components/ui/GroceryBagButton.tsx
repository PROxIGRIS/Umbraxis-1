// src/components/ui/GroceryBagButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * GroceryBagButton
 * - lightweight SVG bag
 * - click opens /cart
 * - keyboard accessible (Enter / Space)
 * - size: "sm" | "md" | "lg"
 */
export function GroceryBagButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const navigate = useNavigate();

  const dims = {
    sm: { w: 48, h: 48, svg: 140 },
    md: { w: 64, h: 64, svg: 180 },
    lg: { w: 88, h: 88, svg: 220 },
  }[size];

  const handleActivate = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    navigate("/cart");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open cart"
      onClick={() => handleActivate()}
      onKeyDown={handleKey}
      className="group inline-flex items-center justify-center"
      style={{ width: dims.w, height: dims.h }}
    >
        {/* container for subtle float + focus/hover effects */}
        <div
          className="relative w-full h-full rounded-2xl flex items-center justify-center animate-floaty"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
        {/* dynamic shadow */}
        <div
          aria-hidden
          className="absolute -bottom-1 w-10/12 h-3 rounded-full opacity-60 transition-all duration-300"
          style={{
            background: "radial-gradient(closest-side, rgba(0,0,0,0.12), transparent)",
            filter: "blur(6px)",
          }}
        />

        {/* SVG bag */}
        <svg
          width={dims.svg}
          height={dims.svg}
          viewBox="0 0 200 200"
          className="relative z-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <title>Cart</title>

          {/* subtle bag rim highlight */}
          <defs>
            <linearGradient id="bagGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#34d399" stopOpacity="1" />
              <stop offset="1" stopColor="#16a34a" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="itemGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#FDE68A" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* bag shadow base (faint) */}
          <ellipse cx="100" cy="164" rx="46" ry="9" fill="rgba(0,0,0,0.08)" />

          {/* bag body */}
          <g filter="url(#soft)">
            <rect
              x="54"
              y="66"
              rx="18"
              ry="18"
              width="92"
              height="104"
              fill="url(#bagGrad)"
              opacity="1"
            />
            {/* rim cut (scallop) */}
            <path
              d="M54 82 q8 -10 18 0 q8 -10 18 0 q8 -10 18 0 q8 -10 18 0 v-6 h-92 z"
              fill="rgba(255,255,255,0.06)"
              transform="translate(0, -6)"
            />
          </g>

          {/* bag handles */}
          <path
            d="M72 62 C76 38, 124 38, 128 62"
            stroke="#14532d"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />

          {/* items peeking out */}
          {/* yellow box (e.g. juice) */}
          <rect x="74" y="44" rx="4" ry="4" width="22" height="30" fill="url(#itemGrad)" />
          {/* orange bottle */}
          <rect x="102" y="40" rx="6" ry="6" width="26" height="34" fill="#fb923c" />
          {/* green leaf */}
          <path
            d="M136 56 C142 48, 160 46, 150 68 C142 86, 122 72, 136 56 Z"
            fill="#34d399"
            stroke="#16a34a"
            strokeWidth="1"
          />

          {/* small subtle highlight on bag */}
          <path
            d="M64 100 q24 -8 72 -8"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Click ripple + keyboard focus visual */}
        <span
          className="absolute inset-0 rounded-2xl transition-transform duration-200 group-hover:scale-102 group-active:scale-98"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 18px rgba(22,163,74,0.06)",
            transformOrigin: "center",
          }}
        />
      </div>

    </div>
  );
}

export default GroceryBagButton;
