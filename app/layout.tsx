import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yalla Market",
  description: "Prediction market demo for Telegram mini app",
};

// Dynamically import WalletConnectProvider with SSR disabled
// This ensures createAppKit is only called on the client side
const WalletConnectProvider = dynamic(
  () => import("@/components/WalletConnectProvider").then((mod) => ({ default: mod.WalletConnectProvider })),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-[#0a0a0a] text-white`}>
        {/* Telegram Mini App SDK: provides window.Telegram.WebApp + initData parsing */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <WalletConnectProvider>
          {children}
        </WalletConnectProvider>
      </body>
    </html>
  );
}
