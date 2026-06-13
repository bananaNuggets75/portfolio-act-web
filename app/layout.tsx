import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kenan Ben G. Polgo - Portfolio",
  description:
    "Computer Science Student at Central Philippine University - Portfolio Website",
  keywords:
    "Kenan Ben G. Polgo, Computer Science, Central Philippine University, Portfolio, Web Developer",
  authors: [{ name: "Kenan Ben G. Polgo" }],
  icons: {
    icon: "/IMG_8516.JPG",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
