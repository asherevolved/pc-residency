"use client";

import { useRef } from "react";

/* Short, 5-star reviews for the ticker */
const marqueeReviews = [
  { name: "Nihal Aslam", text: "One of the finest stays in Mysore. Beautiful ambiance. Highly recommended." },
  { name: "Srivaishanv GC", text: "Quiet roads, fresh rooms, affordable prices. Genuinely a great experience." },
  { name: "Sharath Appikonda", text: "Location was perfect. Rooms decent. Cost within budget. Would book again." },
  { name: "Kavya R.", text: "Lovely hospitality and spotlessly clean rooms. Felt right at home." },
];

function Stars() {
  return (
    <span className="flex gap-[3px]" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="#FBBC04"
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

/* Google "G" logo in brand colours */
function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Google" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="review-marquee-card inline-flex flex-shrink-0 items-center gap-4 mx-5 px-6 py-3 rounded-full bg-white border border-hairline shadow-[0_4px_24px_-8px_rgba(26,26,26,0.12)]">
      <GoogleG />
      <Stars />
      <span className="font-sans text-[13px] text-charcoal font-medium whitespace-nowrap">
        &ldquo;{text}&rdquo;
      </span>
      <span className="text-[11px] tracking-[0.14em] uppercase text-warm-gray font-sans whitespace-nowrap">
        — {name}
      </span>
    </div>
  );
}

export default function ReviewMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  /* Duplicate cards so the loop is seamless */
  const doubled = [...marqueeReviews, ...marqueeReviews];

  return (
    <div className="relative w-full overflow-hidden py-6 border-y border-hairline bg-cream/70 backdrop-blur-sm">
      {/* fade edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--color-cream), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--color-cream), transparent)" }}
      />

      <div
        ref={trackRef}
        className="flex w-max animate-marquee"
        aria-label="Guest review highlights"
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} name={r.name} text={r.text} />
        ))}
      </div>
    </div>
  );
}
