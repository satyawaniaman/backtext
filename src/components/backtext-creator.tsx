"use client";
import DropImage from "./drop-image";
import { useState } from "react";

function BacktextCreator() {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("");
  const [canvasReady, setCanvasReady] = useState(false);
  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);

        // Your background removal logic here
        // const blob = await removeBackground(src);
        // const processedUrl = URL.createObjectURL(blob);
        // setProcessedImageSrc(processedUrl);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
      // await generate();
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="flex flex-col pb-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create your own backtext
        </h1>
        <p className="text-muted-foreground mt-2 flex justify-center leading-7">
          Use one of the templates below
        </p>
      </div>
      <DropImage
        onFileSelect={(file: File | null) => file && setSelectedImage(file)}
      />
    </div>
  );
}
export default BacktextCreator;
