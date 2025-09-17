import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/footer";

export const metadata: Metadata = {
  title: "About — Backtext",
  description:
    "Backtext helps you add clean, readable text behind images using AI background removal and simple typography controls.",
};

export default function AboutPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="mb-8 text-4xl font-bold tracking-wide">
          About Backtext
        </h1>

        <p className="mb-4 text-lg leading-relaxed">
          Backtext is a lightweight web app that makes it simple to add text
          behind images. Whether you’re a creator, marketer, or designer, our
          AI-powered background removal ensures your text blends seamlessly with
          your visuals — without requiring complex design tools.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Our goal is to remove the friction from making professional-looking
          content. With Backtext you can upload any image, place your message
          behind it, adjust fonts, apply tilt, and export instantly. It’s quick,
          intuitive, and reliable.
        </p>

        <p className="mb-4 text-lg leading-relaxed">
          Key features include background removal, flexible text positioning,
          tilt, multiple font options, and one-click export. Every new account
          starts with <strong>3 free credits</strong> so you can try it out.
          When you’re ready for unlimited creation, simply upgrade to our
          affordable
          <strong> $3 plan</strong> — no hidden fees.
        </p>

        <p className="mb-4 text-lg leading-relaxed">
          Backtext is built with modern, production-grade technology: Next.js,
          React, Tailwind CSS, shadcn/ui, Stripe, AWS S3, and OpenAI. This stack
          ensures speed, scalability, and secure handling of your designs.
        </p>

        <p className="mb-10 text-lg leading-relaxed">
          Whether you’re preparing marketing visuals, creating content for
          social media, or experimenting with design ideas — Backtext helps you
          move from concept to polished output in seconds.
        </p>

        <div className="flex gap-3">
          <Link href="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
