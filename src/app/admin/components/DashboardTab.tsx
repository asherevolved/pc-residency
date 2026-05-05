"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BedDouble, CalendarCheck, IndianRupee, MessageSquare,
  TrendingUp, Users, Clock
} from "lucide-react";

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  checkedIn: number;
  totalRevenue: number;
  paidRevenue: number;
  totalRooms: number;
  unreadMessages: number;
}

interface RecentBooking {
  id: string;
  guest_name: string;
  status: string;
  payment_status: string;
  total_amount: number;
  check_in: string;
  room_name: string;
}

export default function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [bookingsRes, roomsRes, contactsRes, recentRes] = await Promise.all([
      supabase.from("bookings").select("status, payment_status, total_amount"),
      supabase.from("rooms").select("id").eq("is_active", true),
      supabase.from("contacts").select("id").eq("is_read", false),
      supabase
        .from("bookings")
        .select("id, guest_name, status, payment_status, total_amount, check_in, rooms(name)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const bookings = bookingsRes.data || [];
    setStats({
      totalBookings: bookings.length,
      confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      checkedIn: bookings.filter((b) => b.status === "checked_in").length,
      totalRevenue: bookings.reduce((s, b) => s + Number(b.total_amount), 0),
      paidRevenue: bookings.filter((b) => b.payment_status === "paid").reduce((s, b) => s + Number(b.total_amount), 0),
      totalRooms: roomsRes.data?.length || 0,
      unreadMessages: contactsRes.data?.length || 0,
    });

    setRecent(
      (recentRes.data || []).map((b: Record<string, unknown>) => ({
        id: b.id as string,
        guest_name: b.guest_name as string,
        status: b.status as string,
        payment_status: b.payment_status as string,
        total_amount: b.total_amount as number,
        check_in: b.check_in as string,
        room_name: (b.rooms as Record<string, unknown>)?.name as string || "—",
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Realtime subscription for live updates
    const channel = supabase
      .channel("dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchData)
      .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;
  if (!stats) return null;

  return (
    <>
      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard icon={CalendarCheck} color="rose" label="Total Bookings" value={stats.totalBookings} sub={`${stats.pendingBookings} pending`} />
        <StatCard icon={IndianRupee} color="green" label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`} sub={`₹${stats.paidRevenue.toLocaleString("en-IN")} collected`} />
        <StatCard icon={Users} color="blue" label="Checked In" value={stats.checkedIn} sub={`${stats.confirmedBookings} confirmed`} />
        <StatCard icon={BedDouble} color="purple" label="Active Rooms" value={stats.totalRooms} sub="Room types" />
        <StatCard icon={MessageSquare} color="amber" label="Unread Messages" value={stats.unreadMessages} sub="From contact form" />
      </div>

      {/* Recent bookings */}
      <div className="section-heading">
        <h2>Recent Bookings</h2>
        <span className="text-muted" style={{ fontSize: 12 }}>
          <Clock size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
          Live — auto-refreshes
        </span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state" style={{ padding: 32 }}><CalendarCheck size={28} style={{ opacity: 0.3 }} /><p style={{ margin: "8px 0 0", fontSize: 13 }}>No bookings yet — they&apos;ll appear here in realtime</p></div></td></tr>
            ) : recent.map((b) => (
              <tr key={b.id}>
                <td style={{ color: "#fff", fontWeight: 600 }}>{b.guest_name}</td>
                <td>{b.room_name}</td>
                <td>{new Date(b.check_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                <td>₹{Number(b.total_amount).toLocaleString("en-IN")}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status.replace("_", " ")}</span></td>
                <td><span className={`badge badge-${b.payment_status}`}>{b.payment_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, color, label, value, sub }: { icon: React.ComponentType<{ size: number }>; color: string; label: string; value: string | number; sub: string }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}><Icon size={22} /></div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
    </div>
  );
}
