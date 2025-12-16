// src/pages/PrivacyPolicy.tsx
import React, { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  FileText,
  CheckCircle2,
  Info,
  Mail,
  Clock,
  Globe2,
} from "lucide-react";

/**
 * Minimal, small Lottie placeholder object.
 * Replace with a refined Lottie file if you have one — keep file size small.
 */
const smallShieldLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "shield-small",
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
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, -6] },
              s: { a: 0, k: [70, 88] },
              r: { a: 0, k: 14 },
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.06, 0.48, 0.95, 1] },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

const SECTIONS = [
  {
    icon: Database,
    title: "Information we collect",
    bullets: [
      "Name, phone, delivery address, and order records.",
      "Device and usage information to keep the site reliable.",
      "Payment references and metadata from payment gateways (we never store raw card data).",
      "Optional notes like delivery instructions.",
    ],
  },
  {
    icon: Lock,
    title: "How we use it",
    bullets: [
      "To accept, prepare and deliver your orders.",
      "To confirm payments, send receipts and updates.",
      "To detect fraud and protect customers and shops.",
      "To improve the storefront and fix issues.",
    ],
  },
  {
    icon: Shield,
    title: "Security",
    bullets: [
      "HTTPS/TLS for all traffic.",
      "Role-based access: staff see only what’s needed.",
      "Encrypted backups and routine integrity checks.",
    ],
  },
  {
    icon: Eye,
    title: "Sharing & disclosure",
    bullets: [
      "We do not sell your personal information.",
      "Delivery partners and payment providers get only the necessary details.",
      "We may disclose data when legally required.",
    ],
  },
  {
    icon: FileText,
    title: "Your rights",
    bullets: [
      "Request a copy of your data.",
      "Ask for corrections or deletion (subject to legal requirements).",
      "Opt out of marketing messages.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Cookies & analytics",
    bullets: [
      "Essential cookies for cart and sessions.",
      "Anonymous analytics to improve reliability.",
      "Browser controls allow cookie clearing and blocking.",
    ],
  },
];

export default function PrivacyPolicy() {
  const [mode, setMode] = useState<"human" | "legal">("human");
  const lastUpdated = useMemo(() => "January 2025", []);

  return (
    <Layout>
      <div className="container py-8 md:py-14 px-4">
        {/* Top hero */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-background/60 border border-border rounded-2xl p-5 md:p-8 lg:p-10 grid gap-6 md:grid-cols-3 items-center">
            {/* Left: Title + description */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                    Privacy Policy
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    We collect only what’s necessary to run the store, process payments, and deliver orders.
                    This page explains what we keep, why we keep it, and how you can control it.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <div className="inline-flex rounded-full border border-border/60 overflow-hidden">
                  <button
                    aria-pressed={mode === "human"}
                    onClick={() => setMode("human")}
                    className={`px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      mode === "human" ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
                    }`}
                  >
                    Human-readable
                  </button>
                  <button
                    aria-pressed={mode === "legal"}
                    onClick={() => setMode("legal")}
                    className={`px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      mode === "legal" ? "bg-secondary text-foreground" : "bg-transparent text-muted-foreground"
                    }`}
                  >
                    Legal-grade
                  </button>
                </div>

                <div className="ml-2 text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Last updated: {lastUpdated}</span>
                  <span className="mx-2">•</span>
                  <Globe2 className="w-3 h-3" />
                  <span>Applies globally</span>
                </div>
              </div>
            </div>

            {/* Right: Trust card with Lottie */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full md:w-auto"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-stretch">
                <div className="flex-1 bg-background/70 border border-border rounded-xl p-3 flex items-center gap-3">
                  {/* Lottie small */}
                  <div className="w-14 h-14 md:w-20 md:h-20">
                    <Lottie
                      animationData={smallShieldLottie}
                      loop
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Security snapshot</p>
                    <p className="text-sm font-semibold mt-1">TLS + Role-based access</p>
                  </div>
                </div>

                <div className="bg-background/60 border border-border rounded-xl p-3 text-xs text-muted-foreground md:w-44">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px]">Backups</div>
                    <div className="text-xs text-primary">Active</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 rounded bg-secondary/5 border border-border/50 text-[11px]">TLS</span>
                    <span className="px-2 py-1 rounded bg-secondary/5 border border-border/50 text-[11px]">Minimal access</span>
                    <span className="px-2 py-1 rounded bg-secondary/5 border border-border/50 text-[11px]">Audit logs</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      Privacy support
                    </div>
                    <a href="/contact" className="text-xs text-primary hover:underline">Contact</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Content area */}
          <div className="mt-8 grid gap-8">
            {mode === "human" ? (
              <div className="grid gap-6">
                {SECTIONS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <article
                      key={s.title}
                      className="flex flex-col md:flex-row gap-4 md:gap-6 bg-background/60 border border-border rounded-lg p-4 md:p-6"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center border border-border">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">{s.title}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {s.bullets.map((b, i) => (
                            <li key={i} className="flex gap-3 items-start">
                              <CheckCircle2 className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              <p className="leading-relaxed">{b}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })}

                <div className="bg-background/60 border border-border rounded-lg p-4 md:p-6">
                  <h4 className="font-semibold mb-2">Data retention</h4>
                  <p className="text-sm text-muted-foreground">
                    We retain order & transaction records as required to provide service, comply with tax or legal obligations,
                    and resolve disputes. On valid deletion requests we remove personal data unless retention is required by law.
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none bg-background/60 border border-border rounded-lg p-4 md:p-6 overflow-auto">
                {/* Legal-grade text – scrollable on mobile */}
                <h2>Full legal policy</h2>
                <p>
                  This legal-grade section provides precise language for compliance. It complements the human-readable
                  summary and is intended to be used for contractual and legal purposes.
                </p>

                <h3>1. Scope</h3>
                <p>
                  These policies govern processing of personal information by the store operator in connection with the
                  store service and related activities. The store operator is the data controller.
                </p>

                <h3>2. Categories of personal data</h3>
                <ul>
                  <li>Identification and contact data (name, phone, address).</li>
                  <li>Order and transaction data (items ordered, prices, totals, payment references).</li>
                  <li>Technical data (IP address, device metadata, logs).</li>
                </ul>

                <h3>3. Legal bases</h3>
                <p>
                  Personal data is processed for contract performance (order fulfilment), compliance with legal
                  obligations, and legitimate interests such as fraud prevention and service improvement.
                </p>

                <h3>4. Recipients & transfers</h3>
                <p>
                  Selected third-party providers (payment processors, hosting, delivery partners) may process data under contract.
                  Where transfers outside the country occur, we ensure appropriate safeguards are in place.
                </p>

                <h3>5. Data subject rights</h3>
                <p>
                  Data subjects may request access, correction, erasure, restriction, and portability to the extent provided by law.
                  Requests should be directed to the store owner via the contact page.
                </p>

                <h3>6. Security measures</h3>
                <p>
                  Appropriate technical and organizational measures are in place including TLS encryption, role-based access control,
                  periodic backups, and logging for forensic purposes.
                </p>

                <h3>7. Changes</h3>
                <p>
                  Updates to this policy will be posted with a revised “Last updated” date. Continued use of the service after updates
                  constitutes acceptance of the revised policy.
                </p>

                <h3>Contact</h3>
                <p>
                  For requests or questions about privacy contact the store owner. We aim to respond to legitimate requests within reasonable statutory timeframes.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-center md:justify-between mt-2">
              <div className="text-sm text-muted-foreground max-w-xl text-center md:text-left">
                Need a copy of your data or want something corrected? Reach out and we’ll handle it.
              </div>
              <div className="flex gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm bg-background/80 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Contact support
                </a>
                <a
                  href="/terms"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm text-primary hover:underline"
                >
                  Read Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
