import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from 'react-hot-toast';
import Container from "@/components/common/Container";


// Load Poppins (for headings)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Arial is a system font, no need to import
// We'll use it directly via CSS variable in globals.css

export const metadata: Metadata = {
  title: "Bundl — Smart Subscription Management",
  description:
    "Bundl lets you manage, combine, and save on your favorite subscriptions directly from your crypto wallet. Create preset bundles or build your own to unlock up to 20% extra savings.",
  keywords: [
    "Bundl",
    "subscription bundles",
    "crypto payments",
    "wallet subscriptions",
    "subscription savings",
    "Web3 subscriptions",
    "digital bundles",
  ],
  authors: [{ name: "Bundl Team" }],
  openGraph: {
    title: "Bundl — Smart Subscription Management",
    description:
      "Simplify your subscriptions. Create or join Bundls, pay once, and save more — all powered by your crypto wallet.",
    siteName: "Bundl",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bundl — Manage and Save on Subscriptions",
    description:
      "Build and manage your subscription bundles with Bundl. Pay once a month and unlock exclusive Web3-powered discounts.",
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

        <NextTopLoader color="#00d5be" height={5} />
        <Container bg="#ffff">
          {children}
        </Container>
        <Toaster />
      </body>
    </html>
  );
}
