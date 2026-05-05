"use client";

import { useState } from "react";
import {
  LayoutDashboard, CalendarCheck, BedDouble, CreditCard,
  MessageSquare, LogOut, Menu, X, Hotel
} from "lucide-react";
import DashboardTab from "./components/DashboardTab";
import BookingsTab from "./components/BookingsTab";
import RoomsTab from "./components/RoomsTab";
import PaymentsTab from "./components/PaymentsTab";
import ContactsTab from "./components/ContactsTab";
import "./admin.css";

const tabs = [
  { id: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { id: "bookings",   label: "Bookings",   icon: CalendarCheck },
  { id: "rooms",      label: "Rooms & Pricing", icon: BedDouble },
  { id: "payments",   label: "Payments",   icon: CreditCard },
  { id: "contacts",   label: "Messages",   icon: MessageSquare },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "bookings":  return <BookingsTab />;
      case "rooms":     return <RoomsTab />;
      case "payments":  return <PaymentsTab />;
      case "contacts":  return <ContactsTab />;
    }
  };

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Hotel size={24} className="text-rose-400" />
          <span className="sidebar-brand">PC Residency</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`sidebar-link ${activeTab === tab.id ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="sidebar-link">
            <LogOut size={18} />
            <span>Back to Site</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="topbar-title">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="topbar-badge">Admin</div>
        </header>
        <div className="admin-content">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
