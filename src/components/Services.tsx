"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Wifi,
  Car,
  UtensilsCrossed,
  Tv,
  AirVent,
  ShieldCheck,
  Coffee,
  Stethoscope,
  Clock,
  Laptop,
  BedDouble,
  Sparkles,
} from "lucide-react";

const amenities = [
  { icon: Clock, label: "24-Hour Front Desk", detail: "Always attended" },
  { icon: Wifi, label: "Free WiFi", detail: "Fast in-room access" },
  { icon: Car, label: "Free Parking", detail: "On-site convenience" },
  { icon: UtensilsCrossed, label: "Free Breakfast", detail: "Fresh morning spread" },
  { icon: AirVent, label: "Air Conditioning", detail: "Cool, quiet rooms" },
  { icon: Tv, label: "LED Smart TV", detail: "Easy entertainment" },
  { icon: Coffee, label: "Tea / Coffee Maker", detail: "In-room refreshment" },
  { icon: Sparkles, label: "Laundry Service", detail: "Clean stay support" },
  { icon: ShieldCheck, label: "24/7 Security", detail: "Monitored premises" },
  { icon: BedDouble, label: "Room Service", detail: "At your door" },
  { icon: Laptop, label: "Airport Shuttle", detail: "Travel assistance" },
  { icon: Stethoscope, label: "Child-Friendly", detail: "Family-ready stays" },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="amenities" ref={ref} className="relative py-24 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="section-panel rounded-[28px] p-6 md:p-10 lg:p-12 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="gsap-reveal grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-12"
          >
            <div className="lg:col-span-7">
              <span className="eyebrow">- Amenities</span>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
                Everything you need,{" "}
                <span className="italic text-accent">nothing</span>{" "}
                you don&apos;t.
              </h2>
            </div>
            <p className="lg:col-span-5 text-[14px] text-warm-gray leading-[1.75] max-w-md lg:ml-auto">
              Move across the amenities to see the red accent respond. Each tile
              now feels more tactile without making the page busy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {amenities.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="amenity-card gsap-reveal group relative min-h-[132px] overflow-hidden rounded-2xl border border-hairline bg-cream/80 p-5 shadow-[0_18px_70px_-56px_rgba(26,26,26,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/70"
                >
                  <div className="amenity-fill absolute inset-y-0 left-0 bg-accent" />
                  <div className="absolute right-4 top-4 h-10 w-10 rounded-full border border-accent/20 transition-all duration-500 group-hover:scale-[5.5] group-hover:border-accent/0 group-hover:bg-accent/25" />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-7">
                    <div className="flex items-center justify-between gap-4">
                      <Icon
                        size={22}
                        strokeWidth={1.7}
                        className="amenity-icon text-charcoal transition-colors duration-500"
                      />
                      <span className="amenity-muted text-[11px] tracking-[0.18em] uppercase text-warm-gray transition-colors duration-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className="amenity-copy font-sans text-[14px] font-semibold text-charcoal transition-colors duration-500">
                        {a.label}
                      </h3>
                      <p className="amenity-muted mt-1 text-[12px] text-warm-gray transition-colors duration-500">
                        {a.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
