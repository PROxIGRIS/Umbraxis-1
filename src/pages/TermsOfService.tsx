// src/pages/TermsOfService.tsx
import React, { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import { Clock, FileText, Shield, Info, Phone } from "lucide-react";

/**
 * Tiny Lottie placeholder — intentionally small to avoid heavy bundles.
 * Replace with a real Lottie JSON if you want, but keep file size < 100KB.
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
    id: "using",
    title: "1. Using the service",
    summary:
      "How KiranaStore works and your basic responsibilities when using the site.",
    content: (
      <>
        <p>
          KiranaStore is an online storefront that connects customers with local shops.
          You may browse items, place orders, and pay for items using supported payment
          gateways. Provide accurate contact and delivery information and comply with
          local laws. Use the service only for lawful purposes.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "2. Orders & payment",
    summary: "How orders are placed, accepted, and charged.",
    content: (
      <>
        <ul className="list-disc ml-5 space-y-1">
          <li>Placing an order is an offer to buy the items selected.</li>
          <li>
            Shops may accept or reject orders (for example, out-of-stock items).
          </li>
          <li>
            Prices shown at checkout are the final charge; payment processing is
            handled by third-party providers — we don't store raw card data.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "delivery",
    title: "3. Delivery & pickup",
    summary: "Who fulfills and how delivery/pickup works.",
    content: (
      <>
        <p>
          Delivery times are estimates. The shop is responsible for preparing and
          fulfilling orders. If you choose pickup, collect your order at the agreed
          time. Any delays or delivery disputes should be raised with the shop first.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "4. Cancellations & refunds",
    summary: "Basic refund & cancellation expectations.",
    content: (
      <>
        <p>
          Cancellation and refund policies may vary by shop. Contact the shop for
          cancellations. Refunds follow the shop's policy and the payment processor's
          rules; processing times may vary.
        </p>
      </>
    ),
  },
  {
    id: "user",
    title: "5. User obligations",
    summary: "What you must not do.",
    content: (
      <>
        <ul className="list-disc ml-5 space-y-1">
          <li>Do not use the service for unlawful purposes.</li>
          <li>Do not submit false information.</li>
          <li>Do not attempt to interfere with the service.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    title: "6. Intellectual property",
    summary: "Ownership of site content and branding.",
    content: (
      <>
        <p>
          All site content, branding, and code are the property of the store owner or
          its licensors. You may not reproduce or redistribute content without permission.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Disclaimers & limitation of liability",
    summary: "Important legal limits (short and readable).",
    content: (
      <>
        <p className="font-medium">
          The service is provided "as is". To the maximum extent permitted by law, the
          store owner disclaims warranties and limits liability for damages from use of
          the service.
        </p>
      </>
    ),
  },
];

export default function TermsOfService() {
  const prefersReduced = useReducedMotion();
  const [showLegal, setShowLegal] = useState(false);
  const lastUpdated = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <Layout>
      <div className="container py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="bg-background/60 border border-border rounded-2xl p-4 md:p-6 lg:p-8 grid gap-4 sm:grid-cols-[1fr_auto] items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Terms of Service</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: <strong>{lastUpdated}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-3 max-w-prose">
                These Terms explain how KiranaStore operates, what we expect from users,
                and what you can expect from shops. They are intentionally short and
                readable — the legal section is available below if you need precise wording.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-3">
              <div className="bg-background/60 border border-border rounded-lg p-2 flex items-center gap-3">
                <div className="w-10 h-10">
                  <Lottie
                    animationData={tinyShieldLottie}
                    loop
                    autoplay={!prefersReduced}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Security-first</div>
                  <div>TLS & role-based access</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLegal((s) => !s)}
                className="whitespace-nowrap"
              >
                {showLegal ? "Hide legal text" : "Show full legal text"}
              </Button>
            </div>
          </div>

          {/* Accordion sections (mobile-first and extremely light) */}
          <div className="mt-6 space-y-3">
            {SECTIONS.map((s) => (
              <details
                key={s.id}
                className="bg-background/60 border border-border rounded-lg"
              >
                <summary className="cursor-pointer px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s.summary}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Details</div>
                </summary>

                <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
                  {s.content}
                </div>
              </details>
            ))}
          </div>

          {/* Short legal CTA + toggle */}
          <div className="mt-6 bg-background/60 border border-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-muted-foreground max-w-xl">
                Want the precise legal wording? Toggle to view the full Terms legal
                section (useful for tax, compliance or store contracts).
              </div>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  onClick={() => setShowLegal(true)}
                  className="whitespace-nowrap"
                >
                  View full legal text
                </Button>
                <a
                  href="/privacy"
                  className="inline-flex items-center px-3 py-2 text-sm rounded-md border border-border/70 bg-transparent hover:bg-background"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>

          {/* Full legal text (lazy, compact) */}
          {showLegal && (
            <motion.section
              initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mt-6 prose prose-invert bg-background/60 border border-border rounded-lg p-4 md:p-6"
            >
              <h2>Full Terms — legal copy</h2>

              <h3>1. Using the service</h3>
              <p>
                KiranaStore provides an online storefront for placing orders with local
                shops. By using the service you agree to these Terms. Provide accurate
                information and follow local laws when using the service.
              </p>

              <h3>2. Orders & payment</h3>
              <p>
                Placing an order constitutes an offer to purchase the items selected.
                Shops may accept or reject orders for reasons including stock availability.
                Prices and availability may change; the price charged is the price shown at checkout.
                Payment processing is handled by third-party providers — sensitive payment data
                is not stored by the store operator.
              </p>

              <h3>3. Delivery & pickup</h3>
              <p>
                Delivery times are estimates. The shop is responsible for fulfilling and delivering the order.
                If pickup is selected the customer is responsible for collecting the order at the agreed time.
              </p>

              <h3>4. Cancellations & refunds</h3>
              <p>
                Cancellation and refund policies may vary by shop. Customers should contact the shop directly
                for cancellations. Refunds are subject to the shop policy and the payment processor's rules.
              </p>

              <h3>5. User obligations</h3>
              <p>
                Users must not use the service for unlawful purposes, submit false information, attempt to interfere
                with the service, or impersonate others.
              </p>

              <h3>6. Intellectual property</h3>
              <p>
                All site content, branding, and code are the property of the store owner or its licensors. Content
                may not be reproduced without permission.
              </p>

              <h3>7. Disclaimers & limitation of liability</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY. TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE
                STORE OWNER DISCLAIMS WARRANTIES AND LIMITS LIABILITY FOR DAMAGES ARISING FROM USE OF THE SERVICE.
              </p>

              <h3>8. Indemnification</h3>
              <p>
                Users agree to indemnify the store owner from claims arising from misuse of the service or breach
                of these Terms.
              </p>

              <h3>9. Governing law</h3>
              <p>
                These Terms are governed by the laws applicable to the store owner's jurisdiction; disputes should
                first be raised with the store owner.
              </p>

              <h3>10. Changes</h3>
              <p>
                We may update these Terms occasionally. A "Last updated" date is shown at the top. Continued use
                after updates constitutes acceptance.
              </p>

              <h3>Contact</h3>
              <p>
                Questions about these Terms should be directed to the store owner. Contact details are available on
                the store page.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Prefer a signed copy or contract? Contact the store owner.
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm bg-primary/10 border border-border hover:bg-primary/5"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact store
                </a>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </Layout>
  );
}
