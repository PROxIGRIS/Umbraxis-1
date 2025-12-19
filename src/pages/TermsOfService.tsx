import React, { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import { FileText, Info, Phone, Shield } from "lucide-react";

/**
 * Lightweight shield animation (kept tiny on purpose)
 */
const tinyShieldLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 120,
  h: 120,
  nm: "tiny-shield",
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shield",
      sr: 1,
      ks: {
        o: { a: 0, k: 90 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [60, 60, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", p: { a: 0, k: [0, -4] }, s: { a: 0, k: [50, 64] }, r: { a: 0, k: 12 } },
            { ty: "fl", c: { a: 0, k: [0.06, 0.48, 0.95, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    },
  ],
};

const SECTIONS = [
  {
    id: "about",
    title: "1. About Ravenius",
    summary: "What Ravenius is and how it operates.",
    content: (
      <p>
        Ravenius is an independent online store offering curated apparel and accessories.
        All products listed are sold directly by the store owner. Ravenius is not a
        marketplace or intermediary and does not represent third-party sellers.
      </p>
    ),
  },
  {
    id: "orders",
    title: "2. Orders & payments",
    summary: "How purchases are placed and processed.",
    content: (
      <ul className="list-disc ml-5 space-y-1">
        <li>Placing an order constitutes an offer to purchase the selected items.</li>
        <li>Orders are confirmed only after successful payment or order confirmation.</li>
        <li>
          Payments are processed via secure third-party gateways. Ravenius does not store
          sensitive payment details.
        </li>
      </ul>
    ),
  },
  {
    id: "pricing",
    title: "3. Pricing & availability",
    summary: "Product prices, stock and changes.",
    content: (
      <p>
        All prices are listed in INR and may change without prior notice. Product availability
        is subject to stock. In rare cases where an item becomes unavailable after ordering,
        customers will be notified promptly.
      </p>
    ),
  },
  {
    id: "shipping",
    title: "4. Shipping & delivery",
    summary: "How orders are shipped and delivered.",
    content: (
      <p>
        Delivery timelines provided are estimates. Ravenius is not responsible for delays
        caused by logistics partners, natural events, or circumstances beyond reasonable control.
      </p>
    ),
  },
  {
    id: "returns",
    title: "5. Returns & cancellations",
    summary: "Current return policy.",
    content: (
      <p className="font-medium">
        At present, Ravenius does not accept returns or exchanges. Please review product
        details carefully before placing an order.
      </p>
    ),
  },
  {
    id: "conduct",
    title: "6. User responsibilities",
    summary: "What users must not do.",
    content: (
      <ul className="list-disc ml-5 space-y-1">
        <li>Do not provide false or misleading information.</li>
        <li>Do not misuse the website or attempt unauthorized access.</li>
        <li>Do not use the platform for unlawful purposes.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "7. Intellectual property",
    summary: "Ownership of content and branding.",
    content: (
      <p>
        All content, branding, images, designs, and code are the property of Ravenius
        unless stated otherwise. Unauthorized reproduction or distribution is prohibited.
      </p>
    ),
  },
  {
    id: "liability",
    title: "8. Disclaimer & limitation of liability",
    summary: "Important legal limitations.",
    content: (
      <p className="font-medium">
        Ravenius provides this website and its services on an “as is” basis. To the maximum
        extent permitted by law, Ravenius shall not be liable for indirect or consequential
        damages arising from the use of the website or products.
      </p>
    ),
  },
];

export default function TermsOfService() {
  const prefersReduced = useReducedMotion();
  const [showLegal, setShowLegal] = useState(false);
  const lastUpdated = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-10 md:py-16 px-4 max-w-4xl">

          {/* HERO */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Last updated: <strong>{lastUpdated}</strong>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-prose">
                These Terms govern your use of Ravenius and the purchase of products from
                our store. Please read them carefully before placing an order.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-12 h-12">
                <Lottie
                  animationData={tinyShieldLottie}
                  loop
                  autoplay={!prefersReduced}
                />
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <div className="font-medium">Secure & Transparent</div>
                <div>Customer-first policies</div>
              </div>
            </div>
          </div>

          {/* SECTIONS */}
          <div className="mt-6 space-y-3">
            {SECTIONS.map((s) => (
              <details
                key={s.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                <summary className="cursor-pointer px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{s.title}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {s.summary}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">View</span>
                </summary>
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {s.content}
                </div>
              </details>
            ))}
          </div>

          {/* FOOTER CTA */}
          <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Have questions about these Terms or our policies?
            </div>
            <div className="flex gap-3">
              <a
                href="/privacy"
                className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Info className="w-4 h-4 mr-2" />
                Privacy Policy
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500 text-zinc-900 text-sm font-semibold hover:bg-amber-400"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
