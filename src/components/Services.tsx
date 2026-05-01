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
  { icon: Clock, label: "24-Hour Front Desk" },
  { icon: Wifi, label: "Free WiFi" },
  { icon: Car, label: "Free Parking" },
  { icon: UtensilsCrossed, label: "Free Breakfast" },
  { icon: AirVent, label: "Air Conditioning" },
  { icon: Tv, label: "LED Smart TV" },
  { icon: Coffee, label: "Tea / Coffee Maker" },
  { icon: Sparkles, label: "Laundry Service" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: BedDouble, label: "Room Service" },
  { icon: Laptop, label: "Airport Shuttle" },
  { icon: Stethoscope, label: "Child-Friendly" },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="amenities" ref={ref} className="py-24 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14"
        >
          <span className="eyebrow">— Amenities</span>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
            Everything you need,{" "}
            <span className="italic text-accent">nothing</span> you don&apos;t.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-hairline">
          {amenities.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-4 p-6 lg:p-8 border-b border-r border-hairline"
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-charcoal flex-shrink-0"
                />
                <span className="text-[13px] text-charcoal font-sans">{a.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
