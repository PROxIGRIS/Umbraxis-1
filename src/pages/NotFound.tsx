import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { ArrowLeft, Compass, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple ambient "void" animation – replace with a real Lottie JSON if you want.
const voidAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Void Orb",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Core",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [50], e: [90] }, { t: 60, s: [90], e: [50] }, { t: 120 }] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120 }] },
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 1, k: [{ t: 0, s: [80, 80], e: [110, 110] }, { t: 120 }] },
      },
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [120, 120] },
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.4, 0.2, 1, 1] },
          o: { a: 0, k: 100 },
        },
      ],
    },
  ],
};

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Cursor tracking for aura
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!hasInteracted) setHasInteracted(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hasInteracted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "h" || e.key === "H") {
        navigate("/");
      }
      if (e.key === "p" || e.key === "p") {
        navigate("/products");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard?.writeText(location.pathname);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const safePath = location.pathname || "/unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background relative overflow-hidden">
      {/* Interactive cursor aura */}
      <div
        className="fixed w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none transition-all duration-300 ease-out -z-10"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          opacity: hasInteracted ? 1 : 0,
        }}
      />

      {/* Gradient blobs (same universe as Privacy Policy) */}
      <div className="absolute -top-64 -right-64 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl -z-10" />

      {/* Floating shards / ambient elements */}
      <motion.div
        className="absolute top-32 left-10 w-32 h-32 rounded-3xl bg-primary/10 blur-xl"
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-40 h-40 rounded-full bg-primary/5 blur-2xl"
        animate={{ y: [0, 18, 0], x: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main section */}
      <section className="relative pt-28 pb-20">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Top back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 rounded-full hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="grid gap-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
            {/* Left: Hero + actions */}
            <div className="text-center lg:text-left space-y-10">
              {/* Orb + 404 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center lg:items-start gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-32 h-32 md:w-40 md:h-40"
                >
                  <Lottie animationData={voidAnimation} loop />
                </motion.div>

                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold mb-4"
                  >
                    <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                      404
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl"
                  >
                    This route was never carved into the system.  
                    You&apos;re standing on the edge of nothing.
                  </motion.p>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    onClick={() => navigate("/")}
                    className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all"
                  >
                    Return Home
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/products")}
                    className="rounded-full px-8 py-6 text-lg hover:shadow-xl transition-all"
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    View products 
                  </Button>
                </motion.div>
              </motion.div>

              {/* Keyboard hint */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-muted-foreground/80"
              >
                Press <span className="px-2 py-0.5 rounded-md border border-border mx-1 text-xs">H</span> for Home or{" "}
                <span className="px-2 py-0.5 rounded-md border border-border mx-1 text-xs">P</span> for Products.
              </motion.div>
            </div>

            {/* Right: Path debug / interaction card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-primary/5 rounded-3xl blur-2xl" />
                <div className="relative bg-background/60 backdrop-blur-md border border-primary/20 rounded-3xl p-8 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold tracking-wide uppercase text-foreground/80">
                      Route Diagnostic
                    </h2>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="flex items-center gap-1 text-xs text-primary"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Scanning
                    </motion.div>
                  </div>

                  {/* Attempted path */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-[0.18em]">
                      Attempted Path
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.01, y: -1 }}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-secondary/60 border border-border/60 cursor-pointer group"
                      onClick={handleCopyPath}
                    >
                      <span className="truncate text-sm font-mono text-foreground/90 group-hover:text-foreground">
                        {safePath}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-[0.18em]">
                      Suggested Routes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Home", path: "/" },
                        { label: "products", path: "/products" },
                        { label: "cart", path: "/cart" },
                        { label: "Support", path: "/contact" },
                      ].map((item) => (
                        <motion.button
                          key={item.path}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => navigate(item.path)}
                          className="px-3 py-1.5 text-xs rounded-full border border-border/70 bg-secondary/60 hover:bg-secondary/90 text-foreground/90"
                        >
                          {item.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Status line */}
                  <div className="pt-3 border-t border-border/60 mt-4 flex items-center justify-between text-xs text-muted-foreground/80">
                    <span>STATUS: ROUTE NOT FOUND</span>
                    <span className="font-mono text-[11px] opacity-80">
                      CODE: 404-VOID
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
