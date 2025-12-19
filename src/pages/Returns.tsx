import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ShieldAlert, Truck, Ban, HelpCircle } from "lucide-react";

export default function Returns() {
  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-12 md:py-20 max-w-4xl">

          {/* HEADER */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-4"
          >
            Returns & Refund Policy
          </motion.h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10">
            Please read carefully before placing an order.
          </p>

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 space-y-10"
          >

            {/* NO RETURNS */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Ban className="h-7 w-7 text-red-500" />
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  No Returns Policy
                </h2>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                As we are a growing business, we currently do <strong>not accept returns</strong>
                or exchanges once an order has been delivered.
              </p>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                All sales made on <strong>Ravenius</strong> are considered final.
                We request customers to carefully review product details,
                images, sizes, and descriptions before placing an order.
              </p>
            </section>

            {/* EXCEPTIONS */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-7 w-7 text-amber-500" />
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Exceptions (Very Limited)
                </h2>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We may offer a replacement or resolution <strong>only</strong> in the following cases:
              </p>

              <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
                <li>Wrong product delivered</li>
                <li>Product damaged during transit</li>
                <li>Manufacturing defect (if applicable)</li>
              </ul>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Any such issue must be reported within <strong>24 hours</strong> of delivery,
                along with clear photos or videos as proof.
              </p>
            </section>

            {/* REFUNDS */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="h-7 w-7 text-indigo-500" />
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Refunds
                </h2>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Refunds are <strong>not applicable</strong> for orders once delivered,
                except in cases approved under the exceptions mentioned above.
              </p>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                If approved, refunds will be processed to the original payment method
                within 5–7 business days.
              </p>
            </section>

            {/* CONTACT */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-7 w-7 text-emerald-500" />
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Need Help?
                </h2>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                If you believe there is an issue with your order, please contact us
                through the <strong>Contact Us</strong> page with your order ID and proof.
              </p>

              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Ravenius reserves the right to make the final decision on all return and refund cases.
              </p>
            </section>

          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
