import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel PC Residency | 3-Star Hotel in Mysuru - Where Quality Meets Value",
  description:
    "Experience exceptional hospitality at Hotel PC Residency, a 3-star hotel at 233, 234, High Tension Double Rd, Vijay Nagar 2nd Stage, Mysuru 570017. Free WiFi, Free Breakfast, Free Parking. Call +91 95388 85988.",
  keywords: [
    "hotel mysuru",
    "PC Residency",
    "hotel mysore vijayanagar",
    "best budget hotel mysuru",
    "hotel near mysore palace",
    "3 star hotel mysuru",
  ],
  openGraph: {
    title: "Hotel PC Residency | 3-Star Hotel in Mysuru",
    description:
      "Where Quality Meets Value in Mysuru. 3-star hotel with free breakfast, WiFi & parking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
