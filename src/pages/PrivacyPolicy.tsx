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
  Tag,
} from "lucide-react";

/**
 * Minimal, small Lottie placeholder object.
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
              // Adjusted Lottie color to amber-ish (approx [1, 0.7, 0.2, 1]) for better fit
              c: { a: 0, k: [0.95, 0.65, 0.1, 1] }, 
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
      "Name, phone, shipping address, and order history for fulfillment.",
      "Device and usage information to ensure site reliability and performance.",
      "Payment method references and transaction metadata (we do not store raw credit card details).",
      "Optional data like sizing preferences or special delivery instructions.",
    ],
  },
  {
    icon: Lock,
    title: "How we use it",
    bullets: [
      "To process, pack, and ship your apparel and home goods orders.",
      "To confirm transactions, issue receipts, and send timely updates.",
      "For security purposes, including fraud detection and account protection.",
      "To personalize your shopping experience and improve our online store features.",
    ],
  },
  {
    icon: Shield,
    title: "Security Measures",
    bullets: [
      "HTTPS/TLS encryption secures all data transmission across the site.",
      "Strict role-based access control limits staff viewing to necessary information.",
      "Regularly encrypted backups and system integrity checks are performed.",
    ],
  },
  {
    icon: Eye,
    title: "Sharing & Disclosure",
    bullets: [
      "We never sell your personal information to third parties.",
      "Data is shared minimally with shipping carriers and payment processors to complete your order.",
      "We may disclose data only when compelled by valid legal processes.",
    ],
  },
  {
    icon: FileText,
    title: "Your Privacy Rights",
    bullets: [
      "You have the right to request a copy of all personal data we hold about you.",
      "You can ask us to correct or delete your data (subject to legal retention requirements).",
      "You may opt out of promotional emails and marketing communications at any time.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Cookies & Site Analytics",
    bullets: [
      "Essential cookies are used solely for session management and maintaining your shopping cart.",
      "Anonymous, aggregated analytics help us understand usage patterns and site performance.",
      "Your browser controls provide tools to manage, clear, or block cookies.",
    ],
  },
];

export default function PrivacyPolicy() {
  const [mode, setMode] = useState<"human" | "legal">("human");
  const lastUpdated = useMemo(() => "January 2025", []);

  // Set the background and container colors to match the theme
  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-10 md:py-16 px-4">
          {/* Top hero */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-8 lg:p-10 grid gap-6 md:grid-cols-3 items-center shadow-xl">
              {/* Left: Title + description */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-amber-500/10 p-3 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Shield className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight text-zinc-900 dark:text-white">
                      MKV Essentials Privacy Policy
                    </h1>
                    <p className="text-md text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg">
                      Your privacy is paramount. We only collect the necessary data to process payments and deliver your items efficiently.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 items-center">
                  <div className="inline-flex rounded-full border border-zinc-300 dark:border-zinc-700 overflow-hidden shadow-sm">
                    {/* Toggle Button - Human Readable (Active: Amber) */}
                    <button
                      aria-pressed={mode === "human"}
                      onClick={() => setMode("human")}
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        mode === "human" 
                          ? "bg-amber-500 text-zinc-900 hover:bg-amber-400" 
                          : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Human Summary
                    </button>
                    {/* Toggle Button - Legal Grade (Active: Dark Zinc) */}
                    <button
                      aria-pressed={mode === "legal"}
                      onClick={() => setMode("legal")}
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${
                        mode === "legal" 
                          ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600" 
                          : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Legal Policy
                    </button>
                  </div>

                  <div className="ml-4 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Last updated: {lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Right: Trust card with Lottie */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full md:w-auto mt-6 md:mt-0"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-stretch">
                  <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-4 flex items-center gap-3 shadow-inner">
                    {/* Lottie small */}
                    <div className="w-16 h-16">
                      <Lottie
                        animationData={smallShieldLottie}
                        loop
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Trust snapshot</p>
                      <p className="text-base font-semibold mt-1 text-zinc-900 dark:text-white">Encrypted & Audited</p>
                    </div>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-500 dark:text-zinc-400 md:w-full">
                    <div className="flex items-center justify-between font-medium">
                      <div className="text-[11px] uppercase tracking-wider">Data Handling</div>
                      <div className="text-xs text-amber-500 font-semibold">Protected</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300">TLS 256-bit</span>
                      <span className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300">Minimization</span>
                      <span className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-[11px] text-zinc-700 dark:text-zinc-300">No Raw PCI</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Mail className="w-3 h-3 text-indigo-500" />
                        Privacy Support
                      </div>
                      <a href="/contact" className="text-xs text-amber-500 font-semibold hover:underline">Contact Now</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content area */}
            <div className="mt-10 grid gap-8">
              {mode === "human" ? (
                <div className="grid gap-6">
                  {SECTIONS.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <motion.article
                        key={s.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="flex flex-col md:flex-row gap-4 md:gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 md:p-8 shadow-md"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
                            <Icon className="w-6 h-6 text-amber-500" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-zinc-900 dark:text-white">{s.title}</h3>
                          <ul className="space-y-3 text-base text-zinc-600 dark:text-zinc-300">
                            {s.bullets.map((b, i) => (
                              <li key={i} className="flex gap-3 items-start">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />
                                <p className="leading-relaxed">{b}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.article>
                    );
                  })}

                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 md:p-8 shadow-md">
                    <h4 className="font-semibold text-xl mb-3 text-zinc-900 dark:text-white">Data Retention Policy</h4>
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      We retain essential order, transaction, and shipping records for as long as necessary to provide service, comply with legal and tax obligations,
                      and resolve disputes. Upon receiving a valid and verified deletion request, we remove personal data unless mandatory retention is required by applicable law.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 md:p-8 overflow-auto shadow-md">
                  {/* Legal-grade text – scrollable on mobile */}
                  <h2 className="text-zinc-900 dark:text-white font-bold mb-4">Full Legal Policy</h2>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    This detailed policy serves as the official legal agreement governing your data. It supersedes the human-readable summary and is intended for legal and compliance purposes.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">1. Scope of Application</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    These policies govern the processing of personal information by MKV Essentials (the "Store Operator") in connection with the operation of the e-commerce service and related business activities. The Store Operator is the data controller.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">2. Categories of Personal Data</h3>
                  <ul className="text-zinc-600 dark:text-zinc-300">
                    <li>**Identity and Contact Data:** Name, phone number, email address, and physical shipping address.</li>
                    <li>**Commercial Data:** Products purchased, order value, transaction history, and fulfillment records.</li>
                    <li>**Technical Data:** IP address, browser type, device identifiers, and website activity logs.</li>
                    <li>**Financial Data:** Encrypted payment token and metadata (No raw PCI data is stored).</li>
                  </ul>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">3. Legal Bases for Processing</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Data processing is primarily based on contract performance (to fulfill your order), compliance with statutory legal obligations (tax and audit), and legitimate interests (security, service improvement, and fraud prevention).
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">4. Recipients and Data Transfers</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Data is disclosed only to essential third-party service providers, including payment processors, hosting partners, and logistics companies, strictly under contractual data processing agreements. Where data is transferred internationally, appropriate safeguards are implemented.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">5. Data Subject Rights</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Individuals may exercise rights of access, correction, erasure (Right to be Forgotten), restriction of processing, and data portability in accordance with applicable data protection laws.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">6. Security and Safeguards</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    We maintain robust technical and organizational security measures, including strong encryption (TLS), secure authentication, regular penetration testing, and disaster recovery planning, to protect data against unauthorized access or disclosure.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">7. Policy Amendments</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    This policy may be amended periodically. All changes will be posted on this page with an updated “Last updated” date. Continued use of our services implies acceptance of any revised policy.
                  </p>

                  <h3 className="text-zinc-900 dark:text-white mt-8 mb-2">Contact Information</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    For all privacy-related inquiries, requests, or concerns, please contact our support team. We are committed to responding promptly and resolving issues efficiently.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-between mt-6">
                <div className="text-base text-zinc-600 dark:text-zinc-300 max-w-xl text-center md:text-left">
                  For any data requests (access, correction, or deletion), please use our dedicated contact form.
                </div>
                <div className="flex gap-3">
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-sm font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                  <a
                    href="/terms"
                    className="inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold text-amber-500 hover:bg-amber-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Read Terms of Service
                    <Tag className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
