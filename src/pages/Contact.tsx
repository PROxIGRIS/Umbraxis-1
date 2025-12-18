import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://awrrsplzkonpzzzbrifz.supabase.co/functions/v1/send-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed");

      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="bg-zinc-50 dark:bg-zinc-950/70 min-h-screen">
        <div className="container py-12 md:py-20">
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white mb-8"
          >
            Contact Us
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8">

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-amber-500 mt-1" />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Email</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      support@yourstore.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-amber-500 mt-1" />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Phone</p>
                    <p className="text-zinc-600 dark:text-zinc-400">+91 9876543210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-amber-500 mt-1" />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">Location</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Katihar, Bihar — India
                    </p>
                  </div>
                </div>

              </div>

              {/* Contact Form */}
              <div className="space-y-4">

                <Input
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Input
                  placeholder="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Input
                  placeholder="Phone Number (optional)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Textarea
                  placeholder="Your Message..."
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="rounded-xl min-h-[120px]"
                />

                <Button
                  onClick={sendMessage}
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-zinc-900 text-white dark:bg-amber-500 dark:text-zinc-900 font-semibold hover:opacity-90"
                >
                  {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                  Send Message
                </Button>

              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
