"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_id: string | null;
  notes: string | null;
  created_at: string;
  room_name: string;
  room_id: string;
}

interface Room {
  id: string;
  name: string;
  price: number;
}

export default function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"view" | "edit" | "create" | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    room_id: "", guest_name: "", guest_email: "", guest_phone: "",
    check_in: "", check_out: "", guests: 1, status: "pending",
    payment_status: "unpaid", notes: "",
  });

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, rooms(name)")
      .order("created_at", { ascending: false });

    setBookings(
      (data || []).map((b: Record<string, unknown>) => ({
        ...b,
        room_name: (b.rooms as Record<string, unknown>)?.name as string || "—",
      })) as Booking[]
    );
    setLoading(false);
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("id, name, price").eq("is_active", true);
    setRooms((data as Room[]) || []);
  };

  useEffect(() => {
    fetchBookings();
    fetchRooms();
    const channel = supabase
      .channel("bookings-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchBookings)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search && !b.guest_name.toLowerCase().includes(search.toLowerCase()) && !b.guest_email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => {
    setForm({ room_id: rooms[0]?.id || "", guest_name: "", guest_email: "", guest_phone: "", check_in: "", check_out: "", guests: 1, status: "pending", payment_status: "unpaid", notes: "" });
    setModal("create");
  };

  const openEdit = (b: Booking) => {
    setSelected(b);
    setForm({
      room_id: b.room_id, guest_name: b.guest_name, guest_email: b.guest_email,
      guest_phone: b.guest_phone || "", check_in: b.check_in, check_out: b.check_out,
      guests: b.guests, status: b.status, payment_status: b.payment_status, notes: b.notes || "",
    });
    setModal("edit");
  };

  const handleSave = async () => {
    const room = rooms.find((r) => r.id === form.room_id);
    const nights = Math.max(1, Math.ceil((new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86400000));
    const total = (room?.price || 0) * nights;

    if (modal === "create") {
      await supabase.from("bookings").insert({
        ...form, total_amount: total,
        payment_id: form.payment_status === "paid" ? `PAY-${Date.now().toString(36).toUpperCase()}` : null,
      });
    } else if (modal === "edit" && selected) {
      await supabase.from("bookings").update({
        ...form, total_amount: total,
      }).eq("id", selected.id);
    }
    setModal(null);
    fetchBookings();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteBooking = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId((cur) => (cur === id ? null : cur)), 3000);
      return;
    }
    setConfirmDeleteId(null);
    await supabase.from("bookings").delete().eq("id", id);
    fetchBookings();
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <>
      {/* Toolbar */}
      <div className="section-heading">
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
            <input className="admin-input" placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 34, width: 220 }} />
          </div>
          <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: 160 }}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state"><p>No bookings found</p></div></td></tr>
            ) : filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ color: "#fff", fontWeight: 600 }}>{b.guest_name}</div>
                  <div style={{ fontSize: 11, color: "#52525b" }}>{b.guest_email}</div>
                </td>
                <td>{b.room_name}</td>
                <td>{new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                <td>{new Date(b.check_out).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                <td>₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status.replace("_", " ")}</span></td>
                <td><span className={`badge badge-${b.payment_status}`}>{b.payment_status}</span></td>
                <td style={{ display: "flex", gap: 4 }}>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setSelected(b); setModal("view"); }} title="View">
                    <Eye size={14} />
                  </button>
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(b)} title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    onClick={() => deleteBooking(b.id)}
                    title="Delete"
                    style={{
                      color: confirmDeleteId === b.id ? "#fff" : "#f87171",
                      background: confirmDeleteId === b.id ? "#dc2626" : undefined,
                      borderColor: confirmDeleteId === b.id ? "#dc2626" : undefined,
                      minWidth: confirmDeleteId === b.id ? 60 : undefined,
                    }}
                  >
                    <Trash2 size={14} />
                    {confirmDeleteId === b.id && <span style={{ fontSize: 11 }}>Sure?</span>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {modal === "view" && selected && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Booking Details</h3>
            <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
              <Row label="Guest" value={selected.guest_name} />
              <Row label="Email" value={selected.guest_email} />
              <Row label="Phone" value={selected.guest_phone || "—"} />
              <Row label="Room" value={selected.room_name} />
              <Row label="Check-in" value={selected.check_in} />
              <Row label="Check-out" value={selected.check_out} />
              <Row label="Guests" value={String(selected.guests)} />
              <Row label="Amount" value={`₹${Number(selected.total_amount).toLocaleString("en-IN")}`} />
              <Row label="Status" value={selected.status} />
              <Row label="Payment" value={selected.payment_status} />
              {selected.payment_id && <Row label="Payment ID" value={selected.payment_id} />}
              {selected.notes && <Row label="Notes" value={selected.notes} />}
            </div>
            <div className="modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(modal === "create" || modal === "edit") && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{modal === "create" ? "New Booking" : "Edit Booking"}</h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <label className="admin-label">Room</label>
                <select className="admin-select" value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })}>
                  {rooms.map((r) => <option key={r.id} value={r.id}>{r.name} — ₹{r.price}/night</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div>
                  <label className="admin-label">Guest Name</label>
                  <input className="admin-input" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Email</label>
                  <input className="admin-input" type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="admin-label">Phone</label>
                  <input className="admin-input" value={form.guest_phone} onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Guests</label>
                  <input className="admin-input" type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="admin-label">Check-in</label>
                  <input className="admin-input" type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Check-out</label>
                  <input className="admin-input" type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="admin-label">Status</label>
                  <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Payment Status</label>
                  <select className="admin-select" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
                    <option value="unpaid">Unpaid</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="admin-label">Notes</label>
                <textarea className="admin-input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ resize: "vertical" }} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {modal === "create" ? "Create Booking" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span style={{ width: 100, flexShrink: 0, color: "#71717a", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ color: "#e4e4e7" }}>{value}</span>
    </div>
  );
}
