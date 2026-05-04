"use client";

import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Nearby from "@/components/Nearby";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import SiteMotion from "@/components/SiteMotion";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="site-shell relative overflow-hidden">
        <SiteMotion />
        <Navbar />
        <Hero />
        <Rooms />
        <About />
        <Reviews />
        <Contact />
        <Nearby />
        <Faq />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
