"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

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

export default function Faq() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="relative py-24 lg:py-32 bg-cream-dark/40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-20 items-start">

          {/* Left — heading (sticky on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 lg:sticky lg:top-32"
          >
            <span className="eyebrow">— FAQ</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
              Common{" "}
              <span className="italic text-accent">questions</span>.
            </h2>
            <p className="mt-6 text-[14px] text-warm-gray leading-[1.8] max-w-xs">
              Can&apos;t find an answer? Reach out to our front desk — we&apos;re available 24 / 7.
            </p>
          </motion.div>

          {/* Right — accordion */}
          <div className="lg:col-span-8 border-t border-hairline">
            {faqs.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                className="border-b border-hairline"
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
              >
                <div className="w-full flex items-center justify-between py-6 text-left group gap-6 cursor-default">
                  <span className="text-[15px] text-charcoal leading-snug">
                    {f.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-warm-gray group-hover:border-accent/40 group-hover:text-accent transition-all duration-200"
                  >
                    <Plus size={16} strokeWidth={1.5} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[14px] text-warm-gray leading-[1.8] max-w-2xl">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
