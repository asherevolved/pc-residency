import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hotel PC Residency",
  description: "Manage bookings, rooms, pricing, and contacts for Hotel PC Residency.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
