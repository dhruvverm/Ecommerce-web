import type { Metadata, Viewport } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wrapt — Gifts worth unwrapping",
    template: "%s · Wrapt",
  },
  description:
    "Hand-wrapped gifts from 62 independent Indian makers. Curated boxes for birthdays, anniversaries, new homes and teams — with the note written in for you.",
  keywords: ["gifts", "gift boxes", "hampers", "corporate gifting", "India", "handmade"],
  openGraph: {
    title: "Wrapt — Gifts worth unwrapping",
    description: "Hand-wrapped gifts from 62 independent Indian makers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff7f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rubik.variable} ${nunito.variable}`}>
      <body className="min-h-dvh">
        <CartProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
