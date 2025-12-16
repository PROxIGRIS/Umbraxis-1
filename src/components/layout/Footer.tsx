import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, ShoppingBag, Home, Package } from "lucide-react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Sparkle animation (lightweight)
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
    <footer className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* TOP CTA */}
          <div className="text-center mb-16 pb-16 border-b border-background/10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Your neighbourhood groceries, elevated
            </h3>

            <p className="text-background/70 text-lg mb-8 max-w-2xl mx-auto">
              Fresh items, fast delivery, and a seamlessly modern shopping experience.
            </p>

            <Link to="/products">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
            </Link>
          </div>

          {/* GRID CONTENT */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-3xl font-bold">KiranaStore</h3>

              <p className="text-background/70 leading-relaxed max-w-md">
                Trusted local convenience brought into the modern era. We deliver quality,
                consistency, and speed — every time.
              </p>

              {/* Contact */}
              <div className="space-y-3 pt-4 text-background/70">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>123 Main Market Road, Mumbai 400001</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+919876543210" className="hover:text-background transition">
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>7:00 AM to 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Quick Links</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <Link to="/" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Legal</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <Link to="/privacy" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* UMBRAXIS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 mb-12"
          >
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-3xl p-10 overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">

              <div className="absolute top-4 right-4 w-20 h-20 opacity-50">
                <Lottie animationData={sparkleAnimation} loop />
              </div>
              <div className="absolute bottom-4 left-4 w-16 h-16 opacity-40">
                <Lottie animationData={sparkleAnimation} loop />
              </div>

              <div className="relative z-10 text-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Crafted by <span className="text-primary">Umbraxis</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-background/70 text-lg mb-6"
                >
                  Premium digital craftsmanship for modern brands
                </motion.p>

                <motion.a
                  href="https://umbraxis.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Visit Umbraxis
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM STRIP */}
          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} KiranaStore. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-background/60">
              <Link to="/privacy" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-background transition-colors">
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
              className="text-background/50 hover:text-background text-sm transition-colors inline-flex items-center gap-1 group"
            >
              Made with ❤️ by
              <span className="text-primary font-semibold group-hover:underline">Umbraxis</span>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
