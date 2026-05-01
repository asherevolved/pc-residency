"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Plus } from "lucide-react";

const faqs = [
  {
    q: "Is there a restaurant on-site?",
    a: "Yes — a multi-cuisine restaurant, rooftop dining, and an air-conditioned dining hall.",
  },
  {
    q: "Do you offer parking?",
    a: "Complimentary car parking is available for all guests within the premises.",
  },
  {
    q: "What is the check-in / check-out time?",
    a: "Check-in is 12:00 PM and check-out is 11:00 AM. Early/late options available subject to availability.",
  },
  {
    q: "Is the hotel family-friendly?",
    a: "Yes. Spacious rooms, child-friendly amenities, and 24/7 security make us suitable for families.",
  },
  {
    q: "What are the nearby attractions?",
    a: "Mysuru Palace (3.2 km), Chamundi Hill (8.5 km), Brindavan Gardens (19 km), and Mysuru Zoo nearby.",
  },
];

const attractions = [
  { name: "Mysuru Palace", distance: "3.2 km" },
  { name: "Chamundi Hill", distance: "8.5 km" },
  { name: "Brindavan Gardens", distance: "19 km" },
  { name: "Mysuru Zoo", distance: "5 km" },
  { name: "Railway Station", distance: "2 km" },
  { name: "Bus Stand", distance: "1 km" },
  { name: "Airport", distance: "12 km" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you — we'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" ref={ref} className="py-24 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-16"
        >
          <span className="eyebrow">— Contact</span>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
            Get in <span className="italic text-accent">touch</span>.
          </h2>
        </motion.div>

        {/* Contact grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={submit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full py-3 bg-transparent border-b border-hairline text-charcoal text-[15px] outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full py-3 bg-transparent border-b border-hairline text-charcoal text-[15px] outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-warm-gray mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full py-3 bg-transparent border-b border-hairline text-charcoal text-[15px] outline-none focus:border-charcoal transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-8 py-4 bg-charcoal text-cream rounded-full text-[12px] tracking-[0.18em] uppercase font-medium font-sans hover:bg-accent transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 space-y-6">
            {[
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
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-5 pb-6 border-b border-hairline last:border-b-0"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-charcoal flex-shrink-0 mt-1"
                  />
                  <div>
                    <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans font-medium mb-1.5">
                      {item.title}
                    </div>
                    {item.lines.map((l) => (
                      <div key={l} className="text-[14px] text-charcoal">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="mt-20 aspect-[21/9] rounded-2xl overflow-hidden border border-hairline">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.2!2d76.6249!3d12.3133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf703c3a7b6e1d%3A0x7d4a8a84c5e8b3e1!2sHotel%20PC%20Residency!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(1) contrast(1.05)" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PC Residency Location"
          />
        </div>

        {/* FAQ + Attractions */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-24 lg:mt-32">
          <div className="lg:col-span-7">
            <span className="eyebrow">— FAQ</span>
            <h3 className="mt-5 mb-10 font-serif text-3xl lg:text-5xl leading-tight tracking-normal text-charcoal">
              Common <span className="italic text-accent">questions</span>.
            </h3>
            <div className="border-t border-hairline">
              {faqs.map((f, i) => (
                <div key={f.q} className="border-b border-hairline">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-[15px] text-charcoal pr-6">
                      {f.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 text-warm-gray group-hover:text-charcoal transition-colors"
                    >
                      <Plus size={18} strokeWidth={1.5} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-[14px] text-warm-gray leading-[1.7] max-w-2xl">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="eyebrow">— Nearby</span>
            <h3 className="mt-5 mb-10 font-serif text-3xl lg:text-5xl leading-tight tracking-normal text-charcoal">
              Around the <span className="italic text-accent">corner</span>.
            </h3>
            <div className="border-t border-hairline">
              {attractions.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between py-4 border-b border-hairline"
                >
                  <span className="text-[14px] text-charcoal">{a.name}</span>
                  <span className="text-[12px] text-warm-gray tabular-nums">
                    {a.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
