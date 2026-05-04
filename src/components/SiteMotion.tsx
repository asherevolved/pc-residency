"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function SiteMotion() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(".gsap-reveal", { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(".gsap-reveal", { autoAlpha: 0, y: 36 });

      ScrollTrigger.batch(".gsap-reveal", {
        start: "top 84%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          });
        },
      });

      gsap.to(".ambient-thread", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      gsap.to(".footer-glow", {
        xPercent: 16,
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: "footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    { scope }
  );

  return <div ref={scope} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}
