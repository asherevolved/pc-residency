"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, CalendarCheck, Mail, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  ["Home",      "#home"],
  ["Rooms",     "#rooms"],
  ["About",     "#about"],
  ["Amenities", "#amenities"],
  ["Reviews",   "#reviews"],
  ["Contact",   "#contact"],
  ["Nearby",    "#nearby"],
  ["FAQ",       "#faq"],
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".footer-rule", start: "top 90%" },
      });
      gsap.from(".footer-col", {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: ".footer-col", start: "top 90%" },
      });
      gsap.from(".footer-bottom", {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".footer-bottom", start: "top 98%" },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const navTo = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const backToTop = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-cream border-t border-hairline"
    >
      {/* Top accent line */}
      <div className="footer-rule h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,34,50,0.45), transparent)" }} />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 pt-16 pb-10">

        {/* Brand row */}
        <div className="footer-col mb-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <a href="#home" className="font-serif text-3xl text-charcoal tracking-normal">
              PC Residency<span className="text-accent">.</span>
            </a>
            <p className="mt-3 text-[13.5px] text-warm-gray leading-[1.8] max-w-xs">
              Where quality meets value in Mysuru. Thoughtful rooms, warm
              hospitality, and practical amenities for every stay.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navTo("#contact")}
              className="inline-flex items-center gap-2 rounded-full bg-charcoal text-cream px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(139,34,50,0.4)]"
            >
              Book a stay <CalendarCheck size={14} strokeWidth={1.8} />
            </button>
            <a
              href="tel:+919538885988"
              className="inline-flex items-center gap-2 rounded-full border border-hairline text-charcoal px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-1"
            >
              Call hotel <Phone size={14} strokeWidth={1.8} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="accent-rule mb-10" />

        {/* Three columns */}
        <div className="grid sm:grid-cols-3 gap-10">

          {/* Navigation */}
          <div className="footer-col">
            <div className="text-[10px] tracking-[0.26em] uppercase text-warm-gray font-sans font-semibold mb-5">
              Explore
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {navLinks.map(([label, href]) => (
                <li key={href}>
                  <button
                    onClick={() => navTo(href)}
                    className="group flex items-center gap-1.5 text-[13.5px] text-warm-gray hover:text-charcoal transition-colors duration-200"
                  >
                    <span className="w-3 h-px bg-accent scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 flex-shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <div className="text-[10px] tracking-[0.26em] uppercase text-warm-gray font-sans font-semibold mb-5">
              Find us
            </div>
            <ul className="space-y-4 text-[13.5px] text-warm-gray">
              <li className="flex gap-3">
                <MapPin size={15} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-accent" />
                <span className="leading-[1.7]">
                  233, 234 High Tension Double Rd,<br />
                  Vijay Nagar 2nd Stage,<br />
                  Mysuru 570017
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={15} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-accent" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+919538885988" className="hover:text-charcoal transition-colors">+91 95388 85988</a>
                  <a href="tel:+919845760545" className="hover:text-charcoal transition-colors">+91 98457 60545</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={15} strokeWidth={1.6} className="mt-0.5 flex-shrink-0 text-accent" />
                <a href="mailto:hotelpcresidency@gmail.com" className="break-all hover:text-charcoal transition-colors">
                  hotelpcresidency@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="footer-col">
            <div className="text-[10px] tracking-[0.26em] uppercase text-warm-gray font-sans font-semibold mb-5">
              Hours
            </div>
            <ul className="space-y-3 text-[13.5px] text-warm-gray">
              <li className="flex justify-between border-b border-hairline pb-3">
                <span>Front Desk</span>
                <span className="text-charcoal font-medium">24 / 7</span>
              </li>
              <li className="flex justify-between border-b border-hairline pb-3">
                <span>Check-in</span>
                <span className="text-charcoal font-medium">12:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-hairline pb-3">
                <span>Check-out</span>
                <span className="text-charcoal font-medium">11:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Restaurant</span>
                <span className="text-charcoal font-medium">7 AM – 11 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom mt-14 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11.5px] text-warm-gray">
            © {new Date().getFullYear()} Hotel PC Residency · Mysuru, Karnataka
          </p>
          <button
            onClick={backToTop}
            className="group flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-sans text-warm-gray hover:border-accent hover:text-accent transition-all duration-300"
          >
            Back to top
            <ArrowUp size={13} strokeWidth={1.8} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </footer>
  );
}
