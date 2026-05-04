"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Landmark, Mountain, Trees, PawPrint, Train, Bus, Plane } from "lucide-react";

const attractions = [
  { name: "Mysuru Palace",     distance: "3.2 km", icon: Landmark  },
  { name: "Chamundi Hill",     distance: "8.5 km", icon: Mountain  },
  { name: "Brindavan Gardens", distance: "19 km",  icon: Trees     },
  { name: "Mysuru Zoo",        distance: "5 km",   icon: PawPrint  },
  { name: "Railway Station",   distance: "2 km",   icon: Train     },
  { name: "Bus Stand",         distance: "1 km",   icon: Bus       },
  { name: "Airport",           distance: "12 km",  icon: Plane     },
];

export default function Nearby() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="nearby" ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="section-panel rounded-[28px] p-8 md:p-10 lg:p-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* Left — heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <span className="eyebrow">— Nearby</span>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
                Around the{" "}
                <span className="italic text-accent">corner</span>.
              </h2>
              <p className="mt-6 text-[14px] text-warm-gray leading-[1.8] max-w-xs">
                Everything that makes Mysuru worth exploring — all within easy
                reach of our front door.
              </p>
            </motion.div>

            {/* Right — attraction list */}
            <div className="lg:col-span-7 border-t border-hairline">
            {attractions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between py-5 border-b border-hairline group cursor-default"
                >
                  <div className="flex items-center gap-3.5">
                    {/* icon badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-hairline flex items-center justify-center shadow-sm transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-[0_4px_16px_-4px_rgba(139,34,50,0.2)]">
                      <Icon size={14} strokeWidth={1.6} className="text-charcoal group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <span className="text-[11px] tracking-[0.16em] text-warm-gray/50 tabular-nums font-sans">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] text-charcoal group-hover:text-accent transition-colors duration-200 font-sans">
                      {a.name}
                    </span>
                  </div>
                  <span className="text-[12px] text-warm-gray tabular-nums bg-cream-dark px-3 py-1.5 rounded-full font-sans">
                    {a.distance}
                  </span>
                </motion.div>
              );
            })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
