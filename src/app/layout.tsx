import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crochetella | Handmade Crochet Shop",
  description: "Shop handmade crochet bags, toys, home goods, and accessories from Crochetella.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
