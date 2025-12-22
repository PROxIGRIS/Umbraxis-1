import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone, MapPin, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type FormData = z.infer<typeof contactSchema>;

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const sendMessage = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone?.trim() || "",
            message: form.message.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed to send message");

      setSubmittedEmail(form.email);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleNewMessage = () => {
    setSubmitted(false);
    setSubmittedEmail("");
  };

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container py-12 md:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-2">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Send us a message and we'll get back to you.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card border border-border rounded-lg shadow-soft max-w-3xl mx-auto overflow-hidden"
          >
            <div className="grid md:grid-cols-5">
              {/* Contact Info Panel */}
              <div className="md:col-span-2 bg-primary text-primary-foreground p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-6">Get in Touch</h2>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary-foreground/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5">Email Support</p>
                      <a
                        href="mailto:support@yourstore.com"
                        className="text-sm opacity-90 hover:opacity-100 hover:underline"
                      >
                        support@yourstore.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary-foreground/10 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5">Phone (Urgent)</p>
                      <a
                        href="tel:+919876543210"
                        className="text-sm opacity-90 hover:opacity-100 hover:underline"
                      >
                        +91 9876543210
                      </a>
                      <p className="text-xs opacity-70 mt-0.5">Mon–Sat, 10 AM – 6 PM IST</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary-foreground/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-0.5">Location</p>
                      <p className="text-sm opacity-90">Katihar, Bihar — India</p>
                    </div>
                  </div>
                </div>

                {/* Response expectation */}
                <div className="mt-8 pt-6 border-t border-primary-foreground/20">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 opacity-80" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Response Time</p>
                      <p className="opacity-80 leading-relaxed">
                        Messages are reviewed by our support team. We respond within one business day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Panel */}
              <div className="md:col-span-3 p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-5">
                        <CheckCircle2 className="h-7 w-7 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Received
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-sm mb-4">
                        We'll respond to <span className="font-medium text-foreground">{submittedEmail}</span> within one business day.
                      </p>
                      <p className="text-xs text-muted-foreground mb-6">
                        Check your spam folder if you don't see a reply. For urgent issues, call us directly.
                      </p>
                      <Button variant="outline" size="sm" onClick={handleNewMessage}>
                        Send Another Message
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                          />
                          {errors.name && (
                            <p id="name-error" className="text-xs text-destructive">{errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                          />
                          {errors.email && (
                            <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            className={`h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? "phone-error" : undefined}
                          />
                          {errors.phone && (
                            <p id="phone-error" className="text-xs text-destructive">{errors.phone}</p>
                          )}
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                          <Label htmlFor="message" className="text-sm font-medium">
                            Message <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Describe your inquiry or issue..."
                            className={`min-h-[120px] resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? "message-error" : undefined}
                          />
                          {errors.message && (
                            <p id="message-error" className="text-xs text-destructive">{errors.message}</p>
                          )}
                        </div>

                        {/* Submit */}
                        <Button
                          onClick={sendMessage}
                          disabled={loading}
                          className="w-full h-11 mt-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>

                        {/* Expectation note */}
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          We'll reply to your email within one business day.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
