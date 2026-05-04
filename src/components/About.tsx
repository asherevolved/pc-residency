"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="section-panel rounded-[28px] p-6 md:p-10 lg:p-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="gsap-reveal lg:col-span-5"
          >
            <span className="eyebrow">— About</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
              Your gateway to
              <br />
              Mysuru&apos;s <span className="italic text-accent">beautiful</span>{" "}
              experiences.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="gsap-reveal lg:col-span-7 lg:pt-6 space-y-5"
          >
            <p className="text-[15px] text-warm-gray leading-[1.75]">
              <span className="text-charcoal">Hotel PC Residency</span> is a
              3-star hotel located at 233, 234, High Tension Double Rd,
              Lokanayaka Nagar, Vijay Nagar 2nd Stage, Mysuru. We offer
              exceptional hospitality, modern amenities, and a warm welcoming
              atmosphere. Strategically located near the city&apos;s transportation
              hub with effortless access to the airport, railway station, and
              bus stand — making it the perfect base for both business and
              leisure travelers.
            </p>
            <p className="text-[15px] text-warm-gray leading-[1.75]">
              Whether you&apos;re here to explore the cultural splendors of
              Mysuru or conduct business, our dedicated team ensures your stay is
              nothing short of extraordinary. With spacious rooms, a multi-cuisine
              restaurant, and personalized services, PC Residency promises a
              comfortable and memorable experience for every guest.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-hairline mt-10">
              {[
                { v: "50+", l: "Rooms" },
                { v: "6 yrs", l: "Of Service" },
                { v: "2K+", l: "Guests Served" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-3xl lg:text-4xl text-charcoal font-semibold">
                    {s.v}
                  </div>
                  <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans mt-1">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Two-image strip */}
        <div className="accent-rule my-14" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="gsap-reveal md:col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_25px_90px_-50px_rgba(26,26,26,0.7)]"
          >
            <Image
              src="/images/real/hero.jpg"
              alt="Hotel PC Residency building exterior"
              fill
              quality={85}
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="gsap-reveal relative aspect-[16/10] md:aspect-auto rounded-2xl overflow-hidden shadow-[0_25px_90px_-50px_rgba(26,26,26,0.7)]"
          >
            <Image
              src="/images/real/entrance.jpg"
              alt="PC Residency entrance view"
              fill
              quality={85}
              className="object-cover"
            />
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
}
