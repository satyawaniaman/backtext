import React, { useState } from "react";
import { Banner } from "./ui/banner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function BannerDemo() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner
      variant="muted"
      className="dark text-foreground"
      isClosable={true}
      onClose={() => setIsVisible(false)}
    >
      <div className="bg-muted/40 flex grow items-center justify-center px-2 py-1 md:px-4">
        <div className="flex items-center text-left md:gap-2">
          <p className="text-muted-foreground text-sm font-medium tracking-tight md:tracking-wide">
            Looking to showcase your product or service on{" "}
            <span className="text-foreground font-semibold">BackText</span>?
            <Link
              href="https://x.com/satyawani_aman"
              className="hover:text-foreground inline"
            >
              <span className=""> DM us on X.</span>
              <ArrowRight
                className="ms-1 -mt-1 inline-flex transition-transform duration-200 group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </p>
        </div>
      </div>
    </Banner>
  );
}

export default BannerDemo;
