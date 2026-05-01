"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Rooms", href: "#rooms" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navTo = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled
            ? "shadow-md"
            : "border-b border-hairline"
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                navTo("#home");
              }}
              className="font-serif text-2xl tracking-tight text-charcoal"
            >
              PC Residency<span className="text-accent">.</span>
            </a>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navTo(link.href)}
                  className="text-[13px] font-sans font-medium text-charcoal/70 hover:text-charcoal transition-colors tracking-wide"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navTo("#booking")}
                className="hidden md:block px-5 py-2.5 text-[12px] tracking-[0.18em] uppercase font-medium font-sans rounded-full bg-charcoal text-cream hover:bg-accent transition-colors duration-300"
              >
                Book Now
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-charcoal"
                aria-label="Menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-cream pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navTo(link.href)}
                  className="text-left py-5 font-serif text-3xl text-charcoal border-b border-hairline"
                >
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={() => navTo("#booking")}
                className="mt-10 w-full py-4 bg-charcoal text-cream rounded-full text-[12px] tracking-[0.18em] uppercase font-medium font-sans"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
