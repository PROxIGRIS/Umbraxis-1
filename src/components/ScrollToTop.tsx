import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay to prevent animation-kill
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 50); // 50ms is the sweet spot

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
