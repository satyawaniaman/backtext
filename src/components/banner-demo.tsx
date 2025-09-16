import React, { useState } from "react";
import { Banner } from "./ui/banner";
import { ArrowRight } from "lucide-react";

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
      <div className="bg-muted/40 flex grow items-center justify-center px-4 py-1">
        <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-4 md:text-left">
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            Looking to showcase your product or service on{" "}
            <span className="text-foreground font-semibold">BackText</span>?
            <span className="hidden md:inline"> DM us on X.</span>
          </p>
          <a
            href="https://x.com/satyawani_aman"
            className="group text-primary inline-flex items-center text-sm font-semibold hover:underline"
          >
            Learn more
            <ArrowRight
              className="ms-1 -mt-0.5 inline-flex transition-transform duration-200 group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </Banner>
  );
}

export default BannerDemo;
