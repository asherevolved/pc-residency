"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, Calendar, Users, CreditCard,
  CheckCircle2, Lock, ArrowRight, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notifyBooking } from "@/lib/notifications";

interface RoomData {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface BookingModalProps {
  room: RoomData;
  onClose: () => void;
}

type Step = "details" | "payment" | "processing" | "confirmed";

export default function BookingModal({ room, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>("details");
  const [guest, setGuest] = useState({
    name: "", email: "", phone: "", guests: 1,
    checkIn: "", checkOut: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", holder: "" });
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const nights = guest.checkIn && guest.checkOut
    ? Math.max(1, Math.ceil((new Date(guest.checkOut).getTime() - new Date(guest.checkIn).getTime()) / 86400000))
    : 0;
  const total = room.price * nights;

  const validateDetails = () => {
    if (!guest.name.trim()) return "Please enter your name";
    if (!guest.email.trim() || !guest.email.includes("@")) return "Please enter a valid email";
    if (!guest.checkIn) return "Please select a check-in date";
    if (!guest.checkOut) return "Please select a check-out date";
    if (new Date(guest.checkOut) <= new Date(guest.checkIn)) return "Check-out must be after check-in";
    return "";
  };

  const validateCard = () => {
    const num = card.number.replace(/\s/g, "");
    if (num.length < 16) return "Enter a valid card number";
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) return "Enter expiry as MM/YY";
    if (card.cvv.length < 3) return "Enter a valid CVV";
    if (!card.holder.trim()) return "Enter the cardholder name";
    return "";
  };

  const goToPayment = () => {
    const err = validateDetails();
    if (err) { setError(err); return; }
    setError("");
    setStep("payment");
  };

  const processPayment = async () => {
    const err = validateCard();
    if (err) { setError(err); return; }
    setError("");
    setStep("processing");

    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2200));

    const paymentId = `PAY-${Date.now().toString(36).toUpperCase()}`;

    const { data, error: dbErr } = await supabase.from("bookings").insert({
      room_id: room.id,
      guest_name: guest.name.trim(),
      guest_email: guest.email.trim(),
      guest_phone: guest.phone.trim() || null,
      check_in: guest.checkIn,
      check_out: guest.checkOut,
      guests: guest.guests,
      total_amount: total,
      status: "confirmed",
      payment_status: "paid",
      payment_id: paymentId,
    }).select("id").single();

    if (dbErr) {
      setError("Something went wrong. Please try again.");
      setStep("payment");
      return;
    }

    setBookingId(data?.id?.slice(0, 8).toUpperCase() || paymentId);
    setStep("confirmed");

    // Send email notifications (fire-and-forget)
    notifyBooking({
      guest_name: guest.name.trim(),
      guest_email: guest.email.trim(),
      room_name: room.name,
      check_in: guest.checkIn,
      check_out: guest.checkOut,
      total_amount: total,
      booking_id: data?.id || paymentId,
      guests: guest.guests,
    });
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white border border-hairline text-charcoal text-[14px] font-sans outline-none placeholder-warm-gray/50 transition-all duration-300 focus:border-accent/40 focus:shadow-[0_0_0_3px_rgba(139,34,50,0.08)]";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto bg-cream rounded-3xl border border-hairline shadow-[0_40px_120px_-30px_rgba(26,26,26,0.6)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-hairline flex items-center justify-center text-warm-gray hover:text-charcoal hover:border-charcoal/20 transition-all"
        >
          <X size={15} />
        </button>

        {/* Header */}
        <div className="px-7 pt-7 pb-4 border-b border-hairline">
          <div className="text-[10.5px] tracking-[0.2em] uppercase font-sans font-semibold text-warm-gray mb-1">
            Book Your Stay
          </div>
          <h3 className="font-serif text-2xl text-charcoal">{room.name}</h3>
          <div className="mt-1 font-serif text-lg text-accent font-light">
            ₹{room.price.toLocaleString("en-IN")} <span className="text-[11px] text-warm-gray font-sans tracking-wider uppercase">/ night</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-7 pt-4 pb-2 flex gap-2">
          {["details", "payment", "confirmed"].map((s, i) => (
            <div key={s} className="flex-1 h-[3px] rounded-full transition-all duration-500" style={{
              background:
                (step === "confirmed" || (step === "processing" && i < 2)) ? "var(--color-accent)"
                : (s === "details" && (step === "details" || step === "payment" || step === "processing")) ? "var(--color-accent)"
                : (s === "payment" && (step === "payment" || step === "processing")) ? "var(--color-accent)"
                : "var(--color-hairline)"
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Guest Details ─── */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="px-7 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <User size={11} className="inline mr-1 align-[-1px]" />Full Name *
                  </label>
                  <input className={inputCls} placeholder="Your name" value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <Mail size={11} className="inline mr-1 align-[-1px]" />Email *
                  </label>
                  <input className={inputCls} type="email" placeholder="you@email.com" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <Phone size={11} className="inline mr-1 align-[-1px]" />Phone
                  </label>
                  <input className={inputCls} type="tel" placeholder="+91 XXXXX XXXXX" value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <Users size={11} className="inline mr-1 align-[-1px]" />Guests
                  </label>
                  <select className={inputCls} value={guest.guests} onChange={(e) => setGuest({ ...guest, guests: Number(e.target.value) })}>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <Calendar size={11} className="inline mr-1 align-[-1px]" />Check-in *
                  </label>
                  <input className={inputCls} type="date" min={today} value={guest.checkIn} onChange={(e) => setGuest({ ...guest, checkIn: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                    <Calendar size={11} className="inline mr-1 align-[-1px]" />Check-out *
                  </label>
                  <input className={inputCls} type="date" min={guest.checkIn || today} value={guest.checkOut} onChange={(e) => setGuest({ ...guest, checkOut: e.target.value })} />
                </div>
              </div>

              {nights > 0 && (
                <div className="rounded-xl bg-white border border-hairline px-4 py-3 flex justify-between items-center">
                  <span className="text-[13px] text-warm-gray">{nights} night{nights > 1 ? "s" : ""} × ₹{room.price.toLocaleString("en-IN")}</span>
                  <span className="font-serif text-xl text-charcoal">₹{total.toLocaleString("en-IN")}</span>
                </div>
              )}

              {error && <p className="text-[12px] text-red-500 font-sans">{error}</p>}

              <button onClick={goToPayment} className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-cream rounded-full text-[11.5px] tracking-[0.2em] uppercase font-sans font-semibold hover:bg-accent transition-all duration-300">
                Continue to Payment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: Payment ─── */}
          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="px-7 py-5 space-y-4">
              <div className="rounded-xl bg-white border border-hairline px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-warm-gray uppercase tracking-wider">Total to pay</div>
                  <div className="font-serif text-2xl text-charcoal">₹{total.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-right text-[12px] text-warm-gray">
                  {nights} night{nights > 1 ? "s" : ""}<br />{guest.name}
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">
                  <CreditCard size={11} className="inline mr-1 align-[-1px]" />Card Number
                </label>
                <input className={inputCls} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">Expiry</label>
                  <input className={inputCls} placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} maxLength={5} />
                </div>
                <div>
                  <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">CVV</label>
                  <input className={inputCls} placeholder="•••" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} maxLength={4} type="password" />
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] tracking-[0.18em] uppercase font-sans font-semibold text-warm-gray mb-1.5">Cardholder Name</label>
                <input className={inputCls} placeholder="Name on card" value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-warm-gray">
                <Lock size={12} /> Secured with 256-bit encryption (demo)
              </div>

              {error && <p className="text-[12px] text-red-500 font-sans">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => { setStep("details"); setError(""); }} className="flex-1 px-6 py-3.5 rounded-full border border-hairline text-charcoal text-[11.5px] tracking-[0.18em] uppercase font-sans font-semibold hover:bg-white transition-all">
                  Back
                </button>
                <button onClick={processPayment} className="flex-[2] group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-charcoal text-cream rounded-full text-[11.5px] tracking-[0.18em] uppercase font-sans font-semibold hover:bg-accent transition-all duration-300">
                  Pay ₹{total.toLocaleString("en-IN")}
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Processing ─── */}
          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-7 py-16 flex flex-col items-center justify-center text-center gap-5">
              <Loader2 size={40} className="text-accent animate-spin" strokeWidth={1.5} />
              <div>
                <p className="font-serif text-xl text-charcoal">Processing payment...</p>
                <p className="text-[13px] text-warm-gray mt-1">Please wait, do not close this window</p>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: Confirmed ─── */}
          {step === "confirmed" && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="px-7 py-10 flex flex-col items-center justify-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif text-2xl text-charcoal mb-1">Booking Confirmed!</p>
                <p className="text-[13px] text-warm-gray">
                  Confirmation sent to <strong className="text-charcoal">{guest.email}</strong>
                </p>
              </div>
              <div className="w-full rounded-xl bg-white border border-hairline p-4 text-left space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-warm-gray">Booking ID</span><span className="text-charcoal font-semibold font-mono">#{bookingId}</span></div>
                <div className="flex justify-between"><span className="text-warm-gray">Room</span><span className="text-charcoal">{room.name}</span></div>
                <div className="flex justify-between"><span className="text-warm-gray">Check-in</span><span className="text-charcoal">{new Date(guest.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                <div className="flex justify-between"><span className="text-warm-gray">Check-out</span><span className="text-charcoal">{new Date(guest.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
                <div className="flex justify-between border-t border-hairline pt-2 mt-2"><span className="text-warm-gray">Total Paid</span><span className="font-serif text-lg text-charcoal">₹{total.toLocaleString("en-IN")}</span></div>
              </div>
              <button onClick={onClose} className="w-full px-8 py-4 bg-charcoal text-cream rounded-full text-[11.5px] tracking-[0.2em] uppercase font-sans font-semibold hover:bg-accent transition-all duration-300">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
