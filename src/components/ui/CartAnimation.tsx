import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { memo } from "react";

interface CartAnimationProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-[140px] h-[140px] md:w-[180px] md:h-[180px]",
  lg: "w-[180px] h-[180px] md:w-[240px] md:h-[240px]",
};

// Grocery bag loading animation - memoized for performance
const CartAnimation = memo(function CartAnimation({ onClick, size = "md" }: CartAnimationProps) {
  return (
    <div className={`${sizeClasses[size]} ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      <DotLottieReact
        src="https://lottie.host/9dbc4a1e-9a47-4c53-8bf4-7a3648a5e9e1/SKzPCvLaFX.lottie"
        loop
        autoplay
      />
    </div>
  );
});

export default CartAnimation;
