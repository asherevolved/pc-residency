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

/* Duplicate so the loop is perfectly seamless */
const track = [...reviews, ...reviews];

function ReviewCard({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figure className="review-card group flex-shrink-0 w-[340px] bg-cream/95 p-8 lg:p-10 flex flex-col rounded-2xl border border-hairline shadow-[0_24px_80px_-55px_rgba(26,26,26,0.7)] hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_30px_90px_-48px_rgba(139,34,50,0.45)] transition-all duration-500 mx-4">
      <div className="text-accent font-serif text-5xl leading-none mb-4 transition-transform duration-500 group-hover:scale-125 origin-left">
        &ldquo;
      </div>
      <blockquote className="font-serif italic text-[15px] text-charcoal leading-[1.7] flex-1">
        {r.text}
      </blockquote>
      <figcaption className="mt-8 pt-6 border-t border-hairline">
        <div className="text-sm font-sans font-medium text-charcoal">{r.name}</div>
        <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans mt-1">
          {r.date} · Google
        </div>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative py-24 lg:py-40 bg-[linear-gradient(135deg,rgba(240,237,232,0.62),rgba(255,255,255,0.45))]"
    >
      {/* ── Header ── */}
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

          {/* Rating */}
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl text-charcoal font-light leading-none">4.0</span>
              <span className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans">/&thinsp;5</span>
            </div>
            <span className="flex gap-1" aria-label="4 out of 5 stars">
              {[1, 2, 3, 4].map((s) => (
                <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill="#FBBC04" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="halfStar">
                    <stop offset="50%" stopColor="#FBBC04" />
                    <stop offset="50%" stopColor="#E8E4DE" />
                  </linearGradient>
                </defs>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#halfStar)" />
              </svg>
            </span>
            <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans">
              Google &middot; 403 reviews
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Infinite scroll track ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative w-full overflow-hidden"
      >
        {/* Fade edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
          style={{ background: "linear-gradient(to right, #f5f2ed, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
          style={{ background: "linear-gradient(to left, #f5f2ed, transparent)" }}
        />

        {/* Scrolling track */}
        <div className="flex animate-reviews-marquee hover:[animation-play-state:paused] py-4">
          {track.map((r, i) => (
            <ReviewCard key={`${r.name}-${i}`} r={r} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
