import "@/styles/globals.css";

import { type Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "Backtext",
  description:
    "Backtext is a lightweight web app that makes it simple to add text behind images using AI background removal and simple typography controls.",
  icons: [{ rel: "icon", url: "/logo.ico" }],
};
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans-variable",
});
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${urbanist.variable} font-sans`}>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
