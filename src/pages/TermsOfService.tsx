// src/pages/TermsOfService.tsx
import React, { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import {
  FileText,
  Info,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Scale
} from "lucide-react";

/**
 * Small neutral animation (optional, cosmetic)
 */
const tinyShieldLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 120,
  h: 120,
  nm: "shield",
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
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", p: { a: 0, k: [0, -4] }, s: { a: 0, k: [50, 64] }, r: { a: 0, k: 12 } },
            { ty: "fl", c: { a: 0, k: [0.1, 0.4, 0.9, 1] }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

const SECTIONS = [
  {
    id: "intro",
    title: "1. About Ravenius & Acceptance of Terms",
    icon: <Scale className="w-4 h-4 text-indigo-600" />,
    content: (
      <div className="space-y-4">
        <p>
          Ravenius is an independent online store selling clothing and lifestyle products.
          We are not a marketplace, aggregator, or reseller for other brands unless clearly stated.
        </p>
        <p>
          By accessing this website, browsing products, or placing an order, you agree to
          follow these Terms of Service. If you do not agree with any part of these terms,
          please do not use the website or place an order.
        </p>
        <p>
          These terms apply to every visitor, customer, and user of the Ravenius website.
        </p>
      </div>
    )
  },

  {
    id: "eligibility",
    title: "2. Eligibility & Responsible Use",
    icon: <FileText className="w-4 h-4 text-zinc-600" />,
    content: (
      <div className="space-y-4">
        <p>
          You must be legally capable of entering into a purchase agreement under the laws
          applicable in your location. If you are under 18, you may use this website only
          with permission from a parent or guardian.
        </p>
        <p>
          You agree not to misuse the website, attempt fraud, abuse payment systems,
          exploit pricing errors, or interfere with the operation of the store.
        </p>
      </div>
    )
  },

  {
    id: "products",
    title: "3. Product Information & Accuracy",
    icon: <Info className="w-4 h-4 text-zinc-600" />,
    content: (
      <div className="space-y-4">
        <p>
          We try to display product images, descriptions, and prices as accurately as possible.
          However, slight differences in color, texture, or appearance may occur due to
          lighting, screens, or manufacturing variations.
        </p>
        <p>
          Product measurements, sizing charts, and material details are provided for guidance only.
          It is your responsibility to review these details before ordering.
        </p>
      </div>
    )
  },

  {
    id: "pricing",
    title: "4. Pricing, Payments & Orders",
    icon: <ShieldAlert className="w-4 h-4 text-zinc-600" />,
    content: (
      <div className="space-y-4">
        <p>
          All prices are listed in Indian Rupees (INR) unless stated otherwise.
          Prices may change at any time without notice.
        </p>
        <p>
          An order is considered confirmed only after successful payment or confirmation
          of Cash on Delivery (if available).
        </p>
        <p>
          We reserve the right to cancel any order if pricing errors, stock issues,
          or suspicious activity is detected.
        </p>
      </div>
    )
  },

  {
    id: "no-returns",
    title: "5. No Returns, No Exchanges, No Refunds",
    icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    content: (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm">
          <strong>ALL SALES ARE FINAL.</strong>
        </div>
        <p>
          Ravenius does not accept returns, exchanges, or refunds.
          Once an order is placed and processed, it cannot be reversed.
        </p>
        <p>
          Please review product details, sizing, and images carefully before ordering.
          Orders placed by mistake, preference changes, or incorrect sizing are not eligible
          for cancellation or refund.
        </p>
      </div>
    )
  },

  {
    id: "shipping",
    title: "6. Shipping, Delivery & Risk",
    icon: <FileText className="w-4 h-4 text-zinc-600" />,
    content: (
      <div className="space-y-4">
        <p>
          Orders are shipped using third-party courier services.
          Delivery timelines are estimates and may vary due to location,
          weather, or courier delays.
        </p>
        <p>
          Responsibility for the package transfers to the customer once the
          order is handed over to the courier.
        </p>
      </div>
    )
  },

  {
    id: "damages",
    title: "7. Damaged or Incorrect Orders",
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    content: (
      <div className="space-y-4">
        <p>
          If you receive a damaged or incorrect item, you must contact us within
          24 hours of delivery with clear photos and order details.
        </p>
        <p>
          Claims submitted after this window may not be reviewed.
          Resolution, if any, is decided at our discretion.
        </p>
      </div>
    )
  },

  {
    id: "liability",
    title: "8. Limitation of Liability",
    icon: <ShieldAlert className="w-4 h-4 text-zinc-600" />,
    content: (
      <div className="space-y-4">
        <p>
          Ravenius is not responsible for indirect losses, delays,
          personal expectations, or third-party service failures.
        </p>
        <p>
          If any liability is found, it will never exceed the amount paid
          for the specific product involved.
        </p>
      </div>
    )
  },

  {
    id: "intellectual",
    title: "9. Intellectual Property",
    icon: <FileText className="w-4 h-4 text-zinc-600" />,
    content: (
      <p>
        All website content including text, images, branding, and design
        belongs to Ravenius and may not be copied or reused without permission.
      </p>
    )
  },

  {
    id: "law",
    title: "10. Governing Law",
    icon: <Scale className="w-4 h-4 text-zinc-600" />,
    content: (
      <p>
        These Terms are governed by the laws of India.
        Any disputes will be subject to local jurisdiction.
      </p>
    )
  },

  {
    id: "contact",
    title: "11. Contact & Communication",
    icon: <Phone className="w-4 h-4 text-zinc-600" />,
    content: (
      <p>
        For questions related to orders or these terms,
        please contact us using the details on the Contact page.
      </p>
    )
  }
];

export default function TermsOfService() {
  const prefersReduced = useReducedMotion();
  const lastUpdated = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <Layout>
      <div className="container max-w-5xl py-12">
        <div className="bg-card border rounded-2xl p-8 mb-8 relative">
          <div className="absolute top-4 right-4 opacity-10">
            <Lottie animationData={tinyShieldLottie} loop={!prefersReduced} />
          </div>

          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Last updated: {lastUpdated}
          </p>
          <p className="max-w-3xl text-muted-foreground">
            These terms explain how Ravenius works, what we expect from customers,
            and how purchases are handled. Please read them carefully.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              id={s.id}
              className="bg-card border rounded-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b">
                <div className="p-2 bg-secondary rounded-md">{s.icon}</div>
                <h2 className="font-semibold">{s.title}</h2>
              </div>
              <div className="p-6 text-sm leading-relaxed text-muted-foreground">
                {s.content}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="text-center text-xs text-muted-foreground mt-12">
          © {new Date().getFullYear()} Ravenius. All rights reserved.
        </div>
      </div>
    </Layout>
  );
}
