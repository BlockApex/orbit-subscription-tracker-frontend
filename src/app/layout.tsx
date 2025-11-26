import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Container from "@/components/common/Container";
import AppRefresh from "@/components/common/AppRefresh";

// Load Poppins (for headings)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbit — Subscription & Spend Tracker",
  description:
    "Orbit Subscription Tracker helps you monitor recurring payments, trial expirations, and future spend forecasts in one smart dashboard. Stay in control, avoid unwanted charges, and track your monthly and upcoming subscription spend effortlessly.",
  keywords: [
    "Orbit",
    "subscription tracker",
    "recurring payments",
    "trial expiration tracking",
    "subscription spend analysis",
    "monthly subscription costs",
    "upcoming payments alerts",
    "digital services tracking",
  ],
  authors: [{ name: "Orbit Team" }],
  openGraph: {
    title: "Orbit — Subscription & Spend Tracker",
    description:
      "Track recurring payments, upcoming charges, and trial deadlines with Orbit. Stay organized and avoid surprise billing with smart spend insights and payment timelines.",
    siteName: "Orbit Subscription Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit — Track Subscriptions & Upcoming Spend",
    description:
      "Monitor recurring subscription payments, active trials, and upcoming charges in one place with Orbit Subscription Tracker. Stay notified and take control of your service spend.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F6754F" />
        <link rel="apple-touch-icon" href="/icons/192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${poppins.variable} antialiased font-body`}>
        <AppRefresh />
        <NextTopLoader color="#00d5be" height={5} />
        <Container bg="#ffff">{children}</Container>
        <Toaster />
      </body>
    </html>
  );
}
