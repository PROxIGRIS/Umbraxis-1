import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMessage = () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields.");
      return;
    }

    const subject = encodeURIComponent(
      `Contact from ${form.name} (${form.email})`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone || "Not provided"}

Message:
${form.message}`
    );

    const mailtoLink = `mailto:theravenius@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    toast.success("Opening your email app…");
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

              {/* INFO */}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Mail className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">
                      theravenius@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">
                      +91 76440 59445
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="h-6 w-6 text-amber-500" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">
                      Katihar, Bihar — India
                    </p>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="space-y-4">
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Input
                  placeholder="Your Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Input
                  placeholder="Phone (optional)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-12 rounded-xl"
                />

                <Textarea
                  placeholder="Your message..."
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-[120px] rounded-xl"
                />

                <Button
                  onClick={sendMessage}
                  className="w-full h-12 rounded-full bg-zinc-900 text-white dark:bg-amber-500 dark:text-zinc-900 font-semibold"
                >
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
