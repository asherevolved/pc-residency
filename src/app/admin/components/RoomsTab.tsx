"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Check, RotateCcw } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  price: number;
  tag: string | null;
  features: string[];
  is_active: boolean;
  max_guests: number;
  description: string | null;
}

export default function RoomsTab() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("*").order("price", { ascending: true });
    const roomData = (data as Room[]) || [];
    setRooms(roomData);
    const prices: Record<string, string> = {};
    roomData.forEach((r) => { prices[r.id] = String(r.price); });
    setEditPrices(prices);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const savePrice = async (roomId: string) => {
    const newPrice = parseFloat(editPrices[roomId]);
    if (isNaN(newPrice) || newPrice < 0) return;
    await supabase.from("rooms").update({ price: newPrice }).eq("id", roomId);
    setSaved((s) => ({ ...s, [roomId]: true }));
    setTimeout(() => setSaved((s) => ({ ...s, [roomId]: false })), 2000);
    fetchRooms();
  };

  const toggleActive = async (roomId: string, current: boolean) => {
    await supabase.from("rooms").update({ is_active: !current }).eq("id", roomId);
    fetchRooms();
  };

  const resetPrice = (room: Room) => {
    setEditPrices((p) => ({ ...p, [room.id]: String(room.price) }));
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <>
      <div className="section-heading">
        <h2>Dynamic Room Pricing</h2>
        <span className="text-muted" style={{ fontSize: 12 }}>
          Edit prices inline and save — changes reflect on the website instantly
        </span>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {rooms.map((room) => (
          <div key={room.id} className="admin-card" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0, fontFamily: "var(--font-sans)" }}>
                  {room.name}
                </h3>
                {room.tag && (
                  <span className="badge badge-confirmed" style={{ fontSize: 10 }}>{room.tag}</span>
                )}
                <span
                  onClick={() => toggleActive(room.id, room.is_active)}
                  className={`badge ${room.is_active ? "badge-checked_in" : "badge-cancelled"}`}
                  style={{ cursor: "pointer", fontSize: 10 }}
                >
                  {room.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
                {room.description || "No description"} • Max {room.max_guests} guests
              </p>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {room.features.map((f) => (
                  <span key={f} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#a1a1aa" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div className="price-edit-row">
                <span style={{ color: "#71717a", fontSize: 18, fontWeight: 700 }}>₹</span>
                <input
                  value={editPrices[room.id] || ""}
                  onChange={(e) => setEditPrices((p) => ({ ...p, [room.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && savePrice(room.id)}
                />
                <span style={{ fontSize: 11, color: "#52525b" }}>/night</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => resetPrice(room)} title="Reset">
                  <RotateCcw size={13} />
                </button>
                <button
                  className={`admin-btn admin-btn-sm ${saved[room.id] ? "admin-btn-ghost" : "admin-btn-primary"}`}
                  onClick={() => savePrice(room.id)}
                  disabled={saved[room.id]}
                >
                  {saved[room.id] ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
