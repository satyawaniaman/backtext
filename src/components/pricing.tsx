import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  return (
    <div id="pricing-section" className="mx-auto max-w-5xl px-6">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-center text-4xl font-semibold lg:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p>
          Start creating stunning text-behind-image effects for free, or upgrade
          to Pro for unlimited access to all premium features.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
        <div className="flex flex-col justify-between space-y-8 rounded-(--radius) border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
          <div className="space-y-4">
            <div>
              <h2 className="font-medium">Free</h2>
              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
              <p className="text-muted-foreground text-sm">Per editor</p>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="">Get Started</Link>
            </Button>

            <hr className="border-dashed" />

            <ul className="list-outside space-y-3 text-sm">
              {[
                "2 free generations per account",
                "Basic text editing features",
                "Access to 5 free fonts",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="size-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">Pro</h2>
                <span className="my-3 block text-2xl font-semibold">
                  $3 / mo
                </span>
                <p className="text-muted-foreground text-sm">Per account</p>
              </div>

              <Button asChild className="w-full">
                <Link href="">Get Started</Link>
              </Button>
            </div>

            <div>
              <div className="text-sm font-medium">
                Everything in free plus :
              </div>

              <ul className="mt-4 list-outside space-y-3 text-sm">
                {[
                  "Unlimited generations per account",
                  "Access to all 20+ fonts",
                  "Letter spacing control",
                  "3D tilt effects",
                  "No ads",
                  "AI Background Removal",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
