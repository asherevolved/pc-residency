"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const rooms = [
  {
    name: "Deluxe A/C Room",
    image: "/images/real/room-double.jpg",
    price: "2,499",
    features: ["Air Conditioning", "LED Smart TV", "Free WiFi", "Tea/Coffee"],
    tag: null,
  },
  {
    name: "Elite A/C Room",
    image: "/images/real/room-twin.jpg",
    price: "1,999",
    features: ["Air Conditioning", "Smart TV", "Tea/Coffee", "Free WiFi"],
    tag: "Popular",
  },
  {
    name: "Superior Non A/C Room",
    image: "/images/real/room-twin.jpg",
    price: "2,499",
    features: ["Spacious Layout", "Smart TV", "Free WiFi", "Toiletries"],
    tag: null,
  },
  {
    name: "Superior A/C Room",
    image: "/images/real/room-double.jpg",
    price: "2,999",
    features: ["Air Conditioning", "Premium Bath", "City View", "Smart TV"],
    tag: "Premium",
  },
];

export default function Rooms() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="rooms" ref={ref} className="py-24 lg:py-40 bg-cream-dark/40">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <span className="eyebrow">— Our Room Types</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal max-w-2xl">
              Stay in <span className="italic text-accent">comfort</span>,
              chosen to your taste.
            </h2>
          </div>
          <p className="text-[14px] text-warm-gray max-w-sm leading-[1.7]">
            Four room categories, each with thoughtful amenities and honest
            pricing. No hidden fees.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rooms.map((room, i) => (
            <motion.article
              key={room.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group bg-cream rounded-2xl overflow-hidden border border-hairline hover:border-charcoal/30 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  quality={80}
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                {room.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-cream text-charcoal text-[11px] tracking-[0.18em] uppercase font-medium font-sans rounded-full">
                    {room.tag}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif text-xl text-charcoal">
                  {room.name}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className="text-[12px] text-warm-gray flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-warm-gray-light" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-hairline flex items-end justify-between">
                  <div>
                    <div className="font-serif text-2xl text-charcoal font-light">
                      ₹{room.price}
                    </div>
                    <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans mt-0.5">
                      Per night
                    </div>
                  </div>
                  <button className="w-9 h-9 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
