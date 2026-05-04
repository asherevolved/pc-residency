"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Wifi, Car, UtensilsCrossed, Tv, AirVent, ShieldCheck, Coffee, Stethoscope, Clock, Laptop, BedDouble, Sparkles } from "lucide-react";

const rooms = [
  {
    name: "Deluxe A/C Room",
    image: "/images/real/room-double.jpg",
    price: "2,225",
    features: ["Air Conditioning", "LED Smart TV", "Free WiFi", "Tea/Coffee"],
    tag: null,
  },
  {
    name: "Elite A/C Room",
    image: "/images/real/room-twin.jpg",
    price: "1,800",
    features: ["Air Conditioning", "Smart TV", "Tea/Coffee", "Free WiFi"],
    tag: "Popular",
  },
  {
    name: "Superior Non A/C Room",
    image: "/images/real/room-twin.jpg",
    price: "1,600",
    features: ["Spacious Layout", "Smart TV", "Free WiFi", "Toiletries"],
    tag: "Best Value",
  },
  {
    name: "Superior A/C Room",
    image: "/images/real/room-double.jpg",
    price: "2,500",
    features: ["Air Conditioning", "Premium Bath", "City View", "Smart TV"],
    tag: "Premium",
  },
];

const amenities = [
  { icon: Clock,          label: "24-Hour Front Desk",  detail: "Always attended"       },
  { icon: Wifi,           label: "Free WiFi",            detail: "Fast in-room access"   },
  { icon: Car,            label: "Free Parking",         detail: "On-site convenience"   },
  { icon: UtensilsCrossed,label: "Free Breakfast",       detail: "Fresh morning spread"  },
  { icon: AirVent,        label: "Air Conditioning",     detail: "Cool, quiet rooms"     },
  { icon: Tv,             label: "LED Smart TV",         detail: "Easy entertainment"    },
  { icon: Coffee,         label: "Tea / Coffee Maker",   detail: "In-room refreshment"   },
  { icon: Sparkles,       label: "Laundry Service",      detail: "Clean stay support"    },
  { icon: ShieldCheck,    label: "24/7 Security",        detail: "Monitored premises"    },
  { icon: BedDouble,      label: "Room Service",         detail: "At your door"          },
  { icon: Laptop,         label: "Airport Shuttle",      detail: "Travel assistance"     },
  { icon: Stethoscope,    label: "Child-Friendly",       detail: "Family-ready stays"    },
];

export default function Rooms() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="rooms" ref={ref} className="relative py-24 lg:py-40 bg-cream-dark/45">
      <div className="ambient-thread" aria-hidden="true" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">

        {/* ── Rooms header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="gsap-reveal flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
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

        {/* ── Room cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rooms.map((room, i) => (
            <motion.article
              key={room.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="gsap-reveal group bg-cream rounded-2xl overflow-hidden border border-hairline shadow-[0_22px_70px_-50px_rgba(26,26,26,0.6)] hover:-translate-y-2 hover:border-accent/50 hover:shadow-[0_30px_90px_-45px_rgba(139,34,50,0.5)] transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  quality={80}
                  className="object-cover group-hover:scale-[1.06] transition-transform duration-700"
                />
                {room.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-cream text-charcoal text-[11px] tracking-[0.18em] uppercase font-medium font-sans rounded-full">
                    {room.tag}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif text-xl text-charcoal">{room.name}</h3>
                <ul className="mt-3 space-y-1.5">
                  {room.features.map((f) => (
                    <li key={f} className="text-[12px] text-warm-gray flex items-center gap-2">
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
                    <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans mt-0.5">
                      Per night
                    </div>
                  </div>
                  <button className="w-9 h-9 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal group-hover:bg-accent group-hover:text-cream group-hover:border-accent transition-all">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── Amenities ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-20 lg:mt-28"
        >
          {/* Divider */}
          <div className="accent-rule mb-14" />

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <span className="eyebrow">— Amenities</span>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-normal text-charcoal">
                Everything you need,{" "}
                <span className="italic text-accent">nothing</span> you don&apos;t.
              </h2>
            </div>
            <p className="text-[14px] text-warm-gray max-w-xs leading-[1.75]">
              Every room and common area is thoughtfully equipped so your stay runs without a hitch.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {amenities.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.04 }}
                  className="amenity-card gsap-reveal group relative min-h-[132px] overflow-hidden rounded-2xl border border-hairline bg-cream/80 p-5 shadow-[0_18px_70px_-56px_rgba(26,26,26,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/70"
                >
                  <div className="amenity-fill absolute inset-y-0 left-0 bg-accent" />
                  <div className="absolute right-4 top-4 h-10 w-10 rounded-full border border-accent/20 transition-all duration-500 group-hover:scale-[5.5] group-hover:border-accent/0 group-hover:bg-accent/25" />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-7">
                    <div className="flex items-center justify-between gap-4">
                      <Icon size={22} strokeWidth={1.7} className="amenity-icon text-charcoal transition-colors duration-500" />
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
        </motion.div>

      </div>
    </section>
  );
}
