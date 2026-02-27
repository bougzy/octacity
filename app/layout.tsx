import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ChatBot from "@/components/ChatBot";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Octa City Bank - Banking Without Boundaries",
  description: "Secure, smart, and seamless banking for the modern world. Manage your finances, access grants, and make global donations with Octa City Bank.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
