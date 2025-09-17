import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Buy Credits",
  description: "Purchase additional Backtext credits to continue creating.",
};

export default function BuyCreditsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Buy Credits</h1>
      <p className="mt-4 text-muted-foreground">
        This is a one time purchase to add more credits to your account.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">50 Credits</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ideal for casual use.</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold">$1</span>
            <Button disabled>Coming Soon</Button>
          </div>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">150 Credits</h2>
            <p className="mt-2 text-sm text-muted-foreground">Great for regular creators.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold">$2</span>
              <Button disabled>Coming Soon</Button>
            </div>
        </div>
      </div>
      <div className="mt-10 flex gap-3">
        <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
        <Link href="/#pricing-section"><Button variant="ghost">See Pricing</Button></Link>
      </div>
    </main>
  );
}
