"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-hairline">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a
              href="#home"
              className="font-serif text-3xl tracking-tight text-charcoal"
            >
              PC Residency<span className="text-accent">.</span>
            </a>
            <p className="mt-5 text-[14px] text-warm-gray leading-[1.7] max-w-sm">
              Where quality meets value. A family-run hotel in the heart of
              Mysuru, since 2020.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans font-medium mb-5">
              Explore
            </div>
            <ul className="space-y-3">
              {[
                ["Home", "#home"],
                ["Rooms", "#rooms"],
                ["About", "#about"],
                ["Reviews", "#reviews"],
                ["Contact", "#contact"],
              ].map(([l, h]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-[14px] text-charcoal/70 hover:text-accent transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[11px] tracking-[0.28em] uppercase text-warm-gray font-sans font-medium mb-5">
              Contact
            </div>
            <ul className="space-y-3 text-[14px] text-charcoal/70">
              <li>Vijay Nagar 2nd Stage, Mysuru 570017</li>
              <li>
                <a
                  href="tel:+919538885988"
                  className="hover:text-accent transition-colors"
                >
                  +91 95388 85988
                </a>
              </li>
              <li>
                <a
                  href="mailto:hotelpcresidency@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  hotelpcresidency@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-warm-gray">
            © {new Date().getFullYear()} Hotel PC Residency · All rights
            reserved.
          </p>
          <button
            onClick={top}
            className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase font-sans font-medium text-charcoal/70 hover:text-charcoal transition-colors"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
