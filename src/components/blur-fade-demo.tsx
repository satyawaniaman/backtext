import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";

export function BlurFadeDemo() {
  return (
    <section id="photos">
      <div className="columns-2 gap-4 sm:columns-2">
        {/* Landscape 1 */}
        <BlurFade delay={0.25} inView>
          <div className="mb-4 w-full overflow-hidden rounded-lg">
            <Image
              src="/image-1.jpeg"
              alt="Landscape 1"
              width={800}
              height={600}
              className="w-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </BlurFade>

        {/* Portrait 1 */}
        <BlurFade delay={0.3} inView>
          <div className="mb-4 w-full overflow-hidden rounded-lg">
            <Image
              src="/image-3.jpeg"
              alt="Portrait 1"
              width={600}
              height={800}
              className="w-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </BlurFade>

        {/* Portrait 2 */}
        <BlurFade delay={0.35} inView>
          <div className="mb-4 w-full overflow-hidden rounded-lg">
            <Image
              src="/image-2.jpeg"
              alt="Portrait 2"
              width={600}
              height={800}
              className="w-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </BlurFade>

        {/* Landscape 2 */}
        <BlurFade delay={0.4} inView>
          <div className="mb-4 w-full overflow-hidden rounded-lg">
            <Image
              src="/image-4.jpeg"
              alt="Landscape 2"
              width={800}
              height={600}
              className="w-full rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
