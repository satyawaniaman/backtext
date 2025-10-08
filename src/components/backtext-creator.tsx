"use client";
import DropImage from "./drop-image";
import { useEffect, useRef, useState } from "react";
import Style from "./image-styles";
import { PuffLoader } from "react-spinners";
import { removeBackground } from "@imgly/background-removal";
function BacktextCreator() {
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("style 1");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      setHasSelectedImage(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);
        const blob = await removeBackground(src);
        const processedUrl = URL.createObjectURL(blob);
        setProcessedImageSrc(processedUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setHasSelectedImage(false);
    }
  };
  useEffect(() => {
    if (canvasReady) {
      drawCompositeImage();
    }
  }, [canvasReady]);
  const drawCompositeImage = () => {};
  return (
    <>
      {imageSrc ? (
        <>
          <canvas
            ref={canvasRef}
            className="max-h-lg h-auto w-full max-w-lg rounded-lg"
          ></canvas>
          {loading && (
            <div className="flex h-full w-full items-center justify-center">
              <PuffLoader size={150} color="foreground" />
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <div className="pb-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Create your own backtext
            </h1>
          </div>
          <DropImage
            onFileSelect={(file: File | null) =>
              setSelectedImage(file ?? undefined)
            }
          />
          {hasSelectedImage && (
            <div className="grid grid-cols-1">
              <p className="text-foreground mt-6 flex justify-center text-center text-2xl leading-7 font-bold tracking-tight md:mt-8">
                choose one of the templates below
              </p>
              <div className="mt-10 flex flex-col items-center justify-between gap-10 md:flex-row">
                <Style
                  image="/style1.png"
                  selectStyle={() => {
                    setSelectedStyle("style 1");
                  }}
                  isSelected={selectedStyle === "style 1"}
                />
                <Style
                  image="/style2.png"
                  selectStyle={() => {
                    setSelectedStyle("style 2");
                  }}
                  isSelected={selectedStyle === "style 2"}
                />
                <Style
                  image="/style3.png"
                  selectStyle={() => {
                    setSelectedStyle("style 3");
                  }}
                  isSelected={selectedStyle === "style 3"}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default BacktextCreator;
