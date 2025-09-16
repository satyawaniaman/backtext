import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";

const images = [
  "/image-1.jpeg",
  "/image-3.jpeg",
  "/image-2.jpeg",
  "/image-4.jpeg",
];

export function BlurFadeDemo() {
  return (
    <section id="photos">
      <div className="columns-2 gap-4 sm:columns-2">
        {images.map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <Image
              className="mb-4 size-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              src={imageUrl}
              alt={`Demo image ${idx + 1}`}
              width={600}
              height={800}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
