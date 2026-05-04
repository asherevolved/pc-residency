"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Calendar, Users, BedDouble, ArrowRight, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Slideshow images ── */
const slides = [
  {
    src: "/images/real/hero.jpg",
    alt: "Hotel PC Residency – Building Exterior Day",
  },
  {
    src: "/images/real/exterior-night.jpg",
    alt: "Hotel PC Residency – Night View with Neon Sign",
  },
  {
    src: "/images/real/room-double.jpg",
    alt: "Deluxe A/C Room – White & Red Bedding",
  },
  {
    src: "/images/real/room-twin.jpg",
    alt: "Elite Room – Gold & Brown Bedding",
  },
  {
    src: "/images/real/entrance.jpg",
    alt: "Hotel PC Residency – Entrance & Reception",
  },
];

const SLIDE_DURATION = 5000; // ms per slide

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const today = todayDate.toISOString().split("T")[0];
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("Deluxe A/C");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Auto-advance slideshow ── */
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  /* ── GSAP scroll effects ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade content out on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "30% top",
          end: "70% top",
          scrub: 1,
        },
      });

      // Darken overlay on scroll
      gsap.to(overlayRef.current, {
        opacity: 0.75,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-screen min-h-[750px] overflow-hidden"
    >
      {/* ── Slideshow background ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].src}
            alt={slides[currentSlide].alt}
            fill
            priority={currentSlide === 0}
            quality={90}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlay ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/70"
        style={{ opacity: 0.55 }}
      />

      {/* ── Subtle noise ── */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-36 lg:bottom-44 left-6 lg:left-12 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              i === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
        <span className="ml-3 text-white/40 text-[10px] tracking-[0.2em] uppercase font-sans">
          {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-end pb-10 lg:pb-16 max-w-[1200px] mx-auto px-6 lg:px-12"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-gold text-[11px] tracking-[0.18em] uppercase font-medium font-sans">
            3-Star Hotel · Mysuru, Karnataka
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[42px] sm:text-[60px] lg:text-[80px] leading-[1.05] tracking-normal text-white max-w-4xl"
        >
          Where quality
          <br />
          meets <span className="italic text-gold-light">value</span>, in the
          <br className="hidden sm:block" /> heart of Mysuru.
        </motion.h1>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 flex items-center gap-8 lg:gap-12"
        >
          {[
            { v: "50+", l: "Rooms" },
            { v: "403", l: "Reviews" },
            { v: "3.9★", l: "Google Rating" },
          ].map((s, i) => (
            <div key={s.l} className="flex items-center gap-3">
              {i > 0 && <div className="w-[1px] h-8 bg-white/20" />}
              <div className={i > 0 ? "pl-3" : ""}>
                <span className="text-white text-2xl lg:text-3xl font-serif font-light leading-none">
                  {s.v}
                </span>
                <span className="block text-white/50 text-[11px] tracking-[0.18em] uppercase mt-1 font-sans">
                  {s.l}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Booking widget ── */}
        <motion.form
          id="booking"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 bg-white rounded-2xl p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col lg:flex-row lg:items-stretch gap-2 lg:gap-0"
        >
          {/* Check-in */}
          <label className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-cream/70 transition-colors cursor-pointer">
            <Calendar size={18} strokeWidth={1.5} className="text-charcoal/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans font-medium">
                Check in
              </div>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="block w-full text-sm text-charcoal bg-transparent outline-none mt-0.5"
              />
            </div>
          </label>

          <div className="hidden lg:block w-px bg-hairline self-stretch my-2" />

          {/* Check-out */}
          <label className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-cream/70 transition-colors cursor-pointer">
            <Calendar size={18} strokeWidth={1.5} className="text-charcoal/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans font-medium">
                Check out
              </div>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="block w-full text-sm text-charcoal bg-transparent outline-none mt-0.5"
              />
            </div>
          </label>

          <div className="hidden lg:block w-px bg-hairline self-stretch my-2" />

          {/* Guests */}
          <label className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-cream/70 transition-colors cursor-pointer">
            <Users size={18} strokeWidth={1.5} className="text-charcoal/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans font-medium">
                Guests
              </div>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="block w-full text-sm text-charcoal bg-transparent outline-none mt-0.5 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <div className="hidden lg:block w-px bg-hairline self-stretch my-2" />

          {/* Room type */}
          <label className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-xl hover:bg-cream/70 transition-colors cursor-pointer">
            <BedDouble size={18} strokeWidth={1.5} className="text-charcoal/60 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] tracking-[0.18em] uppercase text-warm-gray font-sans font-medium">
                Room
              </div>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="block w-full text-sm text-charcoal bg-transparent outline-none mt-0.5 appearance-none cursor-pointer"
              >
                <option>Deluxe A/C</option>
                <option>Elite A/C</option>
                <option>Superior Non A/C</option>
                <option>Superior A/C</option>
              </select>
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="lg:ml-2 inline-flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-white rounded-xl text-[12px] tracking-[0.18em] uppercase font-medium font-sans hover:bg-accent transition-colors duration-300 whitespace-nowrap"
          >
            Check Availability
            <ArrowRight size={14} />
          </button>
        </motion.form>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
      >
        <span className="text-[11px] tracking-[0.18em] uppercase font-sans">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
