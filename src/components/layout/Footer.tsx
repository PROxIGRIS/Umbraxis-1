import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, ShoppingBag, Home, Package, Tag, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Sparkle animation (lightweight) - Color set to a pale amber in the original Lottie data
  const sparkleAnimation = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 100,
    h: 100,
    nm: "Sparkle",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Star",
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 0, s: [0], e: [100] }, { t: 30, s: [100], e: [0] }, { t: 60 }] },
          r: { a: 1, k: [{ t: 0, s: [0], e: [180] }, { t: 60 }] },
          p: { a: 0, k: [50, 50, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 0], e: [100, 100] },
              { t: 30, s: [100, 100], e: [0, 0] },
              { t: 60 },
            ],
          },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "sr",
                p: { a: 0, k: [0, 0] },
                or: { a: 0, k: 15 },
                ir: { a: 0, k: 7 },
                pt: { a: 0, k: 5 },
              },
              {
                ty: "fl",
                // This color [1, 0.9, 0.3, 1] is Yellow/Gold in Lottie
                c: { a: 0, k: [1, 0.9, 0.3, 1] }, 
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
      },
    ],
  };

  return (
    // Changed bg-foreground (which was black) to explicit deep zinc/black for consistency
    <footer className="py-20 bg-zinc-950 text-white relative overflow-hidden">
      {/* Decorative top strip: Changed green tint to Amber accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* TOP CTA - Refocused for Clothing/Essentials */}
          <div className="text-center mb-16 pb-16 border-b border-white/10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Find your next favorite essential.
            </h3>

            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Shop curated winter wear, home textiles, and quality basics for effortless style.
            </p>

            <Link to="/products">
              <Button
                size="lg"
                // Primary button style: Amber background, dark text
                className="rounded-full px-8 py-6 bg-amber-500 hover:bg-amber-400 text-zinc-900 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-105 transition-all"
              >
                <Tag className="w-5 h-5 mr-2" />
                Shop The Collection
              </Button>
            </Link>
          </div>

          {/* GRID CONTENT */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="space-y-4 lg:col-span-2">
              {/* Brand Name Update */}
              <h3 className="text-3xl font-bold text-amber-500">Ravenius</h3>

              <p className="text-white/70 leading-relaxed max-w-md">
                Dedicated to quality, comfort, and sustainable value. We provide stylish, reliable essentials for every modern lifestyle.
              </p>

              {/* Contact */}
              <div className="space-y-3 pt-4 text-white/70">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span>Larkaniya tola, Katihar Bihar 854105</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  {/* Changed hover color to white */}
                  <a href="tel:+919876543210" className="hover:text-white transition">
                    +91 76440 59445
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Mon-Sat: 9:00 AM to 7:00 PM (Online Support)</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  {/* Added subtle transition and hover effect */}
                  <Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    <Home className="w-4 h-4 mr-2 inline-block -mt-0.5" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    <ShoppingBag className="w-4 h-4 mr-2 inline-block -mt-0.5" />
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    <ShieldCheck className="w-4 h-4 mr-2 inline-block -mt-0.5" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    <Package className="w-4 h-4 mr-2 inline-block -mt-0.5" />
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-xl text-white">Customer Care</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link to="/returns" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM STRIP */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Ravenius. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-white/60">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* SMALL MADE BY */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8"
          >
            <a
              href="https://umbraxis.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
            >
              Made with ❤️ by
              <span className="text-amber-500 font-semibold group-hover:underline">Umbraxis</span>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
