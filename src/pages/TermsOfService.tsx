import React, { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import { 
  FileText, 
  Info, 
  Phone, 
  ShieldAlert, 
  Scale, 
  Gavel,
  AlertTriangle 
} from "lucide-react";

/**
 * Lightweight shield animation
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
    id: "agreement",
    title: "1. Acceptance of Terms & Binding Agreement",
    icon: <Scale className="w-4 h-4 text-amber-600" />,
    content: (
      <div className="space-y-4">
        <p>
          By accessing, browsing, or purchasing from the Ravenius website ("Service", "Platform"), you ("User", "Purchaser") unequivocally agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and Ravenius.
        </p>
        <p>
          <strong>IF YOU DO NOT AGREE WITH ANY PART OF THESE TERMS, YOU MUST IMMEDIATELY DISCONTINUE USE OF THE SERVICE.</strong> 
        </p>
        <p>
          Ravenius reserves the right to modify these Terms at any time without prior notice. Continued use of the Platform following any changes signifies your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.
        </p>
      </div>
    ),
  },
  {
    id: "strict-returns",
    title: "2. NO RETURN, NO EXCHANGE & REFUND POLICY",
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
    summary: "CRITICAL: READ CAREFULLY",
    content: (
      <div className="space-y-4 text-zinc-800 dark:text-zinc-200">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 text-sm mb-4">
          <p className="font-bold text-red-700 dark:text-red-400">
            NOTICE: ALL SALES ARE FINAL.
          </p>
          <p className="mt-1 text-red-600 dark:text-red-300">
            By completing a purchase, you waive your right to return items based on subjective preference, fit, or perceived quality issues.
          </p>
        </div>
        <p>
          <strong>2.1 Final Sale Policy:</strong> All products sold on Ravenius are sold on a <strong>"FINAL SALE"</strong> basis. We do not accept returns, exchanges, or provide refunds for any reason, including but not limited to: change of mind, incorrect size ordered by the customer, or dissatisfaction with style/color.
        </p>
        <p>
          <strong>2.2 No Cooling-Off Period:</strong> You expressly acknowledge and agree that any "cooling-off" period or right of withdrawal mandated by general consumer laws is hereby waived to the fullest extent permitted by applicable law, given the specific nature of our inventory.
        </p>
        <p>
          <strong>2.3 Chargebacks:</strong> Any unauthorized chargebacks initiated by the User for a validly delivered order will be contested legally. Ravenius reserves the right to employ third-party collections agencies and report delinquent accounts to credit bureaus.
        </p>
      </div>
    ),
  },
  {
    id: "product-quality",
    title: "3. Disclaimer of Product Warranties & 'As Is' Sale",
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    content: (
      <div className="space-y-4">
        <p>
          <strong>3.1 "As Is" Condition:</strong> The Service and all products delivered to you through the Service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties, or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.
        </p>
        <p>
          <strong>3.2 Manufacturing Variations:</strong> The User acknowledges that minor variations in color, texture, stitching, and finish are inherent to the manufacturing process. Such variations <strong>shall not</strong> qualify as defects. We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your subjective expectations.
        </p>
        <p>
          <strong>3.3 Display Accuracy:</strong> We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate. Discrepancies between the physical item and the digital representation are not grounds for a dispute.
        </p>
      </div>
    ),
  },
  {
    id: "shipping-liability",
    title: "4. Shipping, Risk of Loss & Delivery",
    icon: <FileText className="w-4 h-4 text-zinc-500" />,
    content: (
      <div className="space-y-4">
        <p>
          <strong>4.1 Transfer of Risk:</strong> The risk of loss and title for all items purchased pass to the User upon our delivery of the item to the carrier (logistics partner). Ravenius is not responsible for lost, stolen, or damaged packages once tendered to the carrier.
        </p>
        <p>
          <strong>4.2 Delivery Estimates:</strong> Delivery dates are estimates only. Ravenius shall not be liable for any delays in shipment or delivery caused by weather, carrier delays, acts of God, or other circumstances beyond our control. Failure to deliver by an estimated date does not constitute a breach of contract.
        </p>
      </div>
    ),
  },
  {
    id: "liability-cap",
    title: "5. Limitation of Liability",
    icon: <ShieldAlert className="w-4 h-4 text-zinc-500" />,
    content: (
      <div className="space-y-4">
        <p className="uppercase font-semibold text-xs tracking-wider text-zinc-500">
          Please read this section carefully.
        </p>
        <p>
          In no case shall Ravenius, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.
        </p>
        <p>
          <strong>5.1 Monetary Cap:</strong> Notwithstanding the foregoing, if Ravenius is found liable for any loss or damage which arises out of or is in any way connected with any of the occurrences described above, then the liability of Ravenius will in no event exceed the exact price paid by you for the specific product at issue.
        </p>
      </div>
    ),
  },
  {
    id: "indemnification",
    title: "6. Indemnification",
    icon: <Gavel className="w-4 h-4 text-zinc-500" />,
    content: (
      <p>
        You agree to indemnify, defend and hold harmless Ravenius and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "7. Governing Law & Dispute Resolution",
    icon: <Scale className="w-4 h-4 text-zinc-500" />,
    content: (
      <div className="space-y-4">
        <p>
          These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to principles of conflict of laws.
        </p>
        <p>
          <strong>7.1 Binding Arbitration:</strong> Any dispute arising out of or relating to these Terms or the sales of products shall be settled by binding arbitration. You hereby waive your right to a trial by judge or jury.
        </p>
        <p>
          <strong>7.2 Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
        </p>
      </div>
    ),
  },
];

export default function TermsOfService() {
  const prefersReduced = useReducedMotion();
  const lastUpdated = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen font-sans">
        <div className="container py-10 md:py-16 px-4 max-w-5xl">

          {/* HEADER */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
               <Lottie animationData={tinyShieldLottie} loop={false} />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono mb-6">
              EFFECTIVE DATE: {lastUpdated} | VERSION: 2.4.0 (ENTERPRISE)
            </p>
            <p className="text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed">
              These Terms contain important provisions regarding the use of our website and our sales policy. 
              <strong> They include a mandatory arbitration clause, a class action waiver, and strict limitations on returns and liability.</strong> 
              Please read them carefully.
            </p>
          </div>

          {/* TABLE OF CONTENTS / CONTENT */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {SECTIONS.map((s, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={s.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/20 px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-100 dark:border-zinc-700">
                      {s.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {s.title}
                      </h2>
                      {s.summary && (
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mt-0.5">
                          {s.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {s.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Quick Navigation
                  </h3>
                  <nav className="space-y-1">
                    {SECTIONS.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, use ref scrolling
                          console.log(`Scroll to ${s.id}`);
                        }}
                        className="block px-3 py-2 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:hover:text-white rounded-md transition-colors truncate"
                      >
                        {s.title}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                   <h3 className="font-bold text-amber-800 dark:text-amber-500 mb-2 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Legal Support
                   </h3>
                   <p className="text-xs text-amber-700 dark:text-amber-400 mb-4 leading-relaxed">
                     If you have legal inquiries regarding these Terms, you may contact our legal department. Note that customer support cannot override these Terms.
                   </p>
                   <button className="w-full py-2 bg-white dark:bg-black border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-500 text-xs font-semibold rounded-lg shadow-sm hover:bg-amber-50 dark:hover:bg-zinc-900 transition-colors">
                     Contact Legal Dept
                   </button>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-12 text-center border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <p className="text-xs text-zinc-400 max-w-2xl mx-auto">
              &copy; {new Date().getFullYear()} Ravenius. All rights reserved. Reproduction of these Terms of Service without express written permission is strictly prohibited.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
