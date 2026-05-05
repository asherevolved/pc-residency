"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notifyContact } from "@/lib/notifications";

const infoItems = [
  {
    icon: MapPin,
    title: "Address",
    lines: [
      "233, 234, High Tension Double Rd, Lokanayaka Nagar,",
      "Vijay Nagar 2nd Stage, Mysuru, Karnataka 570017",
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 95388 85988", "+91 98457 60545"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hotelpcresidency@gmail.com"],
  },
  {
    icon: Clock,
    title: "Front Desk",
    lines: ["24/7 — 365 days"],
  },
];

/* ─── Floating-label field wrapper ─── */
function FloatingField({
  label,
  id,
  children,
  delay = 0,
  inView,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <label
        htmlFor={id}
        className="block text-[10.5px] tracking-[0.2em] uppercase font-sans font-semibold text-warm-gray mb-2.5 transition-colors group-focus-within:text-accent"
      >
        {label}
      </label>
      {children}
      {/* accent underline that grows on focus */}
      <span
        className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-accent transition-all duration-500 group-focus-within:w-full rounded-full"
        aria-hidden
      />
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("contacts").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      });
      // Send email notification to admin (fire-and-forget)
      notifyContact({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        message: form.message,
      });
    } catch {
      // silently proceed — message still shows success UI
    }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3500);
  };

  const inputCls =
    "w-full px-4 py-3.5 rounded-xl bg-white/60 border border-hairline text-charcoal text-[14.5px] font-sans outline-none placeholder-warm-gray/50 transition-all duration-300 focus:bg-white focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(139,34,50,0.09)] backdrop-blur-sm";

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-40">
      {/* decorative orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle at center, #8B2232 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="gsap-reveal max-w-2xl mb-16"
        >
          <span className="eyebrow">— Contact</span>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
            Get in <span className="italic text-accent">touch</span>.
          </h2>
          <p className="mt-4 text-[15px] text-warm-gray leading-[1.8] max-w-lg">
            Whether you have a query, want to make a reservation, or simply wish
            to learn more — we&apos;re here around the clock.
          </p>
        </motion.div>

        {/* ── Contact Grid Panel ── */}
        <div className="section-panel rounded-[28px] overflow-hidden grid lg:grid-cols-12">
          {/* ── Form Column ── */}
          <div className="lg:col-span-7 p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-5"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-charcoal mb-2">Message received!</p>
                    <p className="text-[14px] text-warm-gray">
                      We&apos;ll be in touch within 24 hours.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-7"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FloatingField label="Full Name" id="contact-name" delay={0.1} inView={inView}>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                      />
                    </FloatingField>

                    <FloatingField label="Email Address" id="contact-email" delay={0.17} inView={inView}>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                      />
                    </FloatingField>
                  </div>

                  <FloatingField label="Phone (optional)" id="contact-phone" delay={0.24} inView={inView}>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </FloatingField>

                  <FloatingField label="Message" id="contact-message" delay={0.31} inView={inView}>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputCls} resize-none`}
                    />
                  </FloatingField>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-cream rounded-full text-[11.5px] tracking-[0.2em] uppercase font-sans font-semibold hover:bg-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(139,34,50,0.5)]"
                    >
                      Send Message
                      <Send
                        size={14}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Info Column ── */}
          <div className="lg:col-span-5 relative bg-charcoal/[0.03] border-l border-hairline p-8 md:p-10 lg:p-12 flex flex-col gap-8">
            {/* subtle accent strip on the left edge */}
            <span
              aria-hidden
              className="absolute left-0 top-8 bottom-8 w-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(139,34,50,0.6), transparent)",
              }}
            />

            {infoItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex gap-4"
                >
                  {/* icon pill */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-hairline flex items-center justify-center shadow-sm transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-[0_4px_20px_-6px_rgba(139,34,50,0.25)]">
                    <Icon size={16} strokeWidth={1.6} className="text-charcoal group-hover:text-accent transition-colors" />
                  </div>
                  <div className="pt-1">
                    <div className="text-[10px] tracking-[0.22em] uppercase font-sans font-bold text-warm-gray mb-1.5">
                      {item.title}
                    </div>
                    {item.lines.map((l) => (
                      <div key={l} className="text-[13.5px] text-charcoal leading-[1.65]">
                        {l}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Tagline footer */}
            <div className="mt-auto pt-8 border-t border-hairline">
              <p className="text-[12px] text-warm-gray leading-[1.75] italic font-serif">
                &ldquo;Where every stay feels like home — refined hospitality in
                the heart of Mysuru.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Street View */}
        <div className="gsap-reveal mt-20 aspect-[21/9] rounded-2xl overflow-hidden border border-hairline shadow-[0_30px_90px_-55px_rgba(26,26,26,0.55)]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!4v1714989600000!6m8!1m7!1sZ1Hwr2buAi-0be8to8dVwQ!2m2!1d76.61532!2d12.33875!3f54.76!4f-11.46!5f0.7820865974627469"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Hotel PC Residency — Street View"
          />
        </div>

      </div>
    </section>
  );
}

