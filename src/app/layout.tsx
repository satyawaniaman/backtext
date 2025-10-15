import "@/styles/globals.css";

import { type Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  title: "BackText - Text Behind Image Editor",
  description: "Create stunning text behind image effects with AI-powered background removal. Add custom text overlays that appear behind your subjects for professional-looking designs.",
  metadataBase: new URL("https://backtext.fun"),
  keywords: [
    "text behind image",
    "text overlay editor",
    "image text effects",
    "background text",
    "AI image editor",
    "text behind photo",
    "image typography",
    "custom text design"
  ],
  authors: [{ name: "aman satyawani" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/logo.ico" },
    { rel: "apple-touch-icon", url: "/logo.ico" }
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://backtext.fun",
    title: "BackText - Text Behind Image Editor",
    description: "Create stunning text behind image effects with AI-powered background removal. Add custom text overlays that appear behind your subjects for professional-looking designs.",
    siteName: "BackText",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BackText - Text Behind Image Editor",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BackText - Text Behind Image Editor",
    description: "Create stunning text behind image effects with AI-powered background removal. Add custom text overlays that appear behind your subjects for professional-looking designs.",
    creator: "@backtext",
    images: [
      {
        url: "https://backtext.fun/og-image.png",
        alt: "BackText - Text Behind Image Editor",
      },
    ],
  },
  alternates: {
    canonical: "https://backtext.fun",
  },
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
        <Analytics />
      </body>
      
    </html>
  );
}
