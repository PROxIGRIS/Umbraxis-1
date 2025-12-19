import { Layout } from "@/components/layout/Layout";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import { Sparkles, ShieldCheck, Truck, HeartHandshake } from "lucide-react";

/**
 * Minimal premium Lottie animation (abstract growth / craft theme)
 * Keep size < 100KB
 */
const brandLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "ravenius-mark",
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] }, t: 0, s: [80, 80, 100] },
            { t: 45, s: [100, 100, 100] }
          ],
        },
      },
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [120, 120] },
          p: { a: 0, k: [0, 0] },
          nm: "Ellipse",
        },
        {
          ty: "fl",
          c: { a: 0, k: [0.96, 0.75, 0.2, 1] },
          o: { a: 0, k: 100 },
          nm: "Fill",
        },
      ],
    },
  ],
};

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-12 md:py-20 max-w-5xl">

          {/* HERO */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4"
              >
                Built with intent.  
                <span className="block text-amber-500">Designed to endure.</span>
              </motion.h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-prose">
                Ravenius is not a mass-market brand chasing trends.  
                It is a focused experiment in quality, restraint, and long-term value.
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="w-48 h-48">
                <Lottie
                  animationData={brandLottie}
                  loop
                  autoplay={!prefersReducedMotion}
                />
              </div>
            </div>
          </div>

          {/* STORY */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-xl mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 dark:text-white mb-6">
              The Ravenius Philosophy
            </h2>

            <div className="space-y-5 text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
              <p>
                Ravenius was created with a simple question in mind:  
                <strong> Why does everything feel disposable?</strong>
              </p>

              <p>
                Fashion today moves fast, but meaning is lost even faster. Ravenius
                exists to slow that down. We focus on fewer products, stronger identity,
                and deliberate decisions — from design to delivery.
              </p>

              <p>
                This is an independent, owner-led brand. Every product listed here
                is chosen intentionally. No middlemen. No inflated narratives.
              </p>
            </div>
          </motion.section>

          {/* VALUES */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Sparkles,
                title: "Intentional Design",
                desc: "No excess. No noise. Every detail has a reason."
              },
              {
                icon: ShieldCheck,
                title: "Trust & Transparency",
                desc: "Clear pricing, honest policies, zero manipulation."
              },
              {
                icon: Truck,
                title: "Reliable Fulfilment",
                desc: "What you order is what you receive. Period."
              },
              {
                icon: HeartHandshake,
                title: "Long-Term Thinking",
                desc: "Built to last, not to go viral."
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md"
              >
                <v.icon className="h-8 w-8 text-amber-500 mb-4" />
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CLOSING */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
              Ravenius is still early. That’s intentional.  
              We are building carefully — not loudly.
            </p>

            <p className="font-semibold text-zinc-900 dark:text-white">
              If you value substance over noise, you’re already part of it.
            </p>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
                }
