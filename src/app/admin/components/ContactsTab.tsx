"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, CheckCheck, Clock, Trash2, Eye } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts((data as Contact[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
    const channel = supabase
      .channel("contacts-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "contacts" }, fetchContacts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("contacts").update({ is_read: true }).eq("id", id);
    fetchContacts();
  };

  const markUnread = async (id: string) => {
    await supabase.from("contacts").update({ is_read: false }).eq("id", id);
    fetchContacts();
  };

  const deleteContact = async (id: string) => {
    await supabase.from("contacts").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    fetchContacts();
  };

  const viewContact = (c: Contact) => {
    setSelected(c);
    if (!c.is_read) markRead(c.id);
  };

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return !c.is_read;
    if (filter === "read") return c.is_read;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  return (
    <>
      <div className="section-heading">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2>Contact Messages</h2>
          {unreadCount > 0 && (
            <span className="badge badge-unread">{unreadCount} unread</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              className={`admin-btn admin-btn-sm ${filter === f ? "admin-btn-primary" : "admin-btn-ghost"}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 16 }}>
        {/* Message list */}
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Mail size={36} />
              <p>No messages</p>
            </div>
          ) : filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => viewContact(c)}
              className="admin-card"
              style={{
                cursor: "pointer",
                borderColor: selected?.id === c.id ? "rgba(244,63,94,0.3)" : undefined,
                background: !c.is_read ? "#1a1c22" : undefined,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {!c.is_read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fb7185", flexShrink: 0 }} />}
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a", marginBottom: 6 }}>{c.email}</div>
                  <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.message}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "#52525b" }}>
                    <Clock size={11} style={{ display: "inline", verticalAlign: -1, marginRight: 3 }} />
                    {timeAgo(c.created_at)}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={(e) => { e.stopPropagation(); deleteContact(c.id); }}
                      title="Delete"
                      style={{ padding: "4px 6px" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="admin-card" style={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-sans)" }}>
                  {selected.name}
                </h3>
                <div style={{ fontSize: 13, color: "#71717a" }}>{selected.email}</div>
                {selected.phone && (
                  <div style={{ fontSize: 13, color: "#71717a" }}>{selected.phone}</div>
                )}
              </div>
              <span className={`badge ${selected.is_read ? "badge-read" : "badge-unread"}`}>
                {selected.is_read ? "Read" : "Unread"}
              </span>
            </div>

            <div style={{ fontSize: 12, color: "#52525b", marginBottom: 12 }}>
              {new Date(selected.created_at).toLocaleString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </div>

            <div style={{
              padding: 16, borderRadius: 12,
              background: "#0f1117",
              border: "1px solid rgba(255,255,255,0.04)",
              fontSize: 14, color: "#d4d4d8", lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}>
              {selected.message}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => selected.is_read ? markUnread(selected.id) : markRead(selected.id)}
              >
                {selected.is_read ? <><Eye size={13} /> Mark Unread</> : <><CheckCheck size={13} /> Mark Read</>}
              </button>
              <button
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => deleteContact(selected.id)}
                style={{ color: "#f87171" }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
