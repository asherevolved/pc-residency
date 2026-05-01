"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reviews = [
  {
    name: "Nihal Aslam",
    date: "Feb 2025",
    text: "One of the finest stays in the outskirts of Mysore. The hotel is well-equipped in all terms with a beautiful ambiance. Highly recommended.",
  },
  {
    name: "Srivaishanv GC",
    date: "Dec 2024",
    text: "Located near many food places. Quiet roads, fresh nature-inspired rooms, and affordable prices. Genuinely a great experience.",
  },
  {
    name: "Sharath Appikonda",
    date: "Jan 2025",
    text: "The location was perfect, near the bus stand. The rooms were decent and the cost was within our budget. Would book again.",
  },
];

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="reviews" ref={ref} className="py-24 lg:py-40 bg-cream-dark/40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="eyebrow">— Reviews</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal max-w-xl">
              What our <span className="italic text-accent">guests</span> say.
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <div className="font-serif text-5xl text-charcoal font-light">
              3.9
            </div>
            <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans mt-1">
              Google · 348 reviews
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-2xl overflow-hidden">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-cream p-8 lg:p-10 flex flex-col"
            >
              <div className="text-accent font-serif text-5xl leading-none mb-4">
                &ldquo;
              </div>
              <blockquote className="font-serif italic text-[15px] text-charcoal leading-[1.7] flex-1">
                {r.text}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-hairline">
                <div className="text-sm font-sans font-medium text-charcoal">{r.name}</div>
                <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans mt-1">
                  {r.date} · Google
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
