import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/header";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { BlurFadeDemo } from "@/components/blur-fade-demo";
import StackIcon from "tech-stack-icons";
import { BlurFade } from "./ui/blur-fade";
import { LineShadowText } from "./ui/line-shadow";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen w-full ">
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="pt-12 pb-8 md:pb-32 lg:pt-44 lg:pb-56">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <BlurFade delay={0.25} inView>
                <div className="mx-auto max-w-lg py-12 text-center lg:mt-12 lg:ml-0 lg:w-1/2 lg:text-left">
                  <h1 className="max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16 xl:text-7xl">
                    Add Text Behind
                    <LineShadowText className="italic">
                      Images
                    </LineShadowText>{" "}
                    Easily
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg text-pretty">
                    Highly customizable text behind image tool, it&apos;s
                    simple, fast and <br /> easy to use tool
                  </p>

                  <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                    <Button asChild size="lg" className="px-5 text-base">
                      <Link href="/dashboard">
                        <span className="text-nowrap">Select Image</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </BlurFade>

              {/* BlurFade Demo Layout */}
              <div className="order-first mt-32 ml-auto lg:absolute lg:top-0 lg:right-0 lg:order-last lg:mt-0 lg:w-1/2">
                <BlurFadeDemo />
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">built using</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="aws" />
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="tailwindcss" />
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="vercel" />
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="openai" />
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="typescript" />
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{ width: 40, height: 40 }}>
                      <StackIcon name="react" />
                    </div>
                  </div>
                  <div className="flex">
                    <Image
                      src="/nextjs.svg"
                      alt="Next.js"
                      width={40}
                      height={40}
                    />
                  </div>
                </InfiniteSlider>
              </div>
            </div>
          </div> */}
        </section>
      </main>
    </div>
  );
}
