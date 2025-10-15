"use client";

import { useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import PuffLoader from "react-spinners/PuffLoader";
import { IoMdArrowBack } from "react-icons/io";
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { inter, domine, playfairDisplay, lato, montserrat, poppins } from "../app/fonts";
import Dropzone from "./drop-image";

const BacktextCreator = () => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const [text, setText] = useState("POV");
  const [font, setFont] = useState("arial");
  const [horizontalPosition, setHorizontalPosition] = useState(50); // 0-100 percentage
  const [verticalPosition, setVerticalPosition] = useState(50); // 0-100 percentage
  const [textSize, setTextSize] = useState(90); // 10-200 percentage of auto-calculated size
  const [textColor, setTextColor] = useState("#ffffff"); // Hex color for text
  const [textOpacity, setTextOpacity] = useState(100); // 0-100 percentage opacity
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Processing your image...");

  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      setError(null);
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large. Please select an image under 10MB.");
        setLoading(false);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file.");
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const src = e.target?.result as string;
          setImageSrc(src);
          setLoadingMessage("Removing background...");

          const blob = await removeBackground(src);
          setLoadingMessage("Finalizing...");
          
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImageSrc(processedUrl);
          setCanvasReady(true);
          setLoading(false);
          setLoadingMessage("Processing your image...");
        } catch (err) {
          console.error("Error processing image:", err);
          setError("Failed to process image. Please try again with a different image.");
          setLoading(false);
          setLoadingMessage("Processing your image...");
        }
      };
      
      reader.onerror = () => {
        setError("Failed to read the image file. Please try again.");
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (canvasReady) {
      const timeoutId = setTimeout(() => {
        drawCompositeImage();
      }, 100); // Debounce canvas updates by 100ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [canvasReady, text, font, horizontalPosition, verticalPosition, textSize, textColor, textOpacity]);

  const drawCompositeImage = () => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc)
      return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();

    bgImg.onload = () => {
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      ctx.save();

      // Calculate font size to fill image 90% of the canvas
      let fontSize = 100;
      let selectFont = "arial";
      switch (font) {
        case "inter":
          selectFont = inter.style.fontFamily;
          break;
        case "domine":
          selectFont = domine.style.fontFamily;
          break;
        case "lato":
          selectFont = lato.style.fontFamily;
          break;
        case "montserrat":
          selectFont = montserrat.style.fontFamily;
          break;
        case "poppins":
          selectFont = poppins.style.fontFamily;
          break;
        case "playfairDisplay":
          selectFont = playfairDisplay.style.fontFamily;
          break;
      }
      
      // Set initial alignment for measurement
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${fontSize}px ${selectFont}`;
      const textWidth = ctx.measureText(text).width;
      const targetWidth = canvas.width * 0.9;

      fontSize *= targetWidth / textWidth;
      
      // Apply text size multiplier with guardrails
      fontSize *= (textSize / 100);
      
      ctx.font = `bold ${fontSize}px ${selectFont}`;

      ctx.fillStyle = textColor;
      ctx.globalAlpha = textOpacity / 100;

      // Calculate horizontal position (0-100 percentage)
      const x = (canvas.width * horizontalPosition) / 100;
      
      // Calculate vertical position (0-100 percentage)  
      const y = (canvas.height * verticalPosition) / 100;

      // Set text alignment based on position
      if (horizontalPosition <= 20) {
        ctx.textAlign = "left";
      } else if (horizontalPosition >= 80) {
        ctx.textAlign = "right";
      } else {
        ctx.textAlign = "center";
      }

      if (verticalPosition <= 20) {
        ctx.textBaseline = "top";
      } else if (verticalPosition >= 80) {
        ctx.textBaseline = "bottom";
      } else {
        ctx.textBaseline = "middle";
      }

      ctx.fillText(text, x, y);
      ctx.restore();

      const fgImg = new Image();
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0, canvas.width, canvas.height);
      };

      fgImg.src = processedImageSrc;
    };

    bgImg.src = imageSrc;
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "backtext-image.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setProcessedImageSrc(null);
    setCanvasReady(false);
    setError(null);
    setText("POV");
    setFont("arial");
    setHorizontalPosition(50);
    setVerticalPosition(50);
    setTextSize(90);
    setTextColor("#ffffff");
    setTextOpacity(100);
  };

  return (
    <>
      {imageSrc ? (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
                  <PuffLoader size={150} color="black" />
                  <p className="text-lg font-medium text-muted-foreground">{loadingMessage}</p>
                  <span className="sr-only">{loadingMessage}</span>
            </div>
          ) : (
            <div className="flex w-full max-w-4xl flex-col items-center gap-5 px-4">
              <div className="my-4 flex w-full flex-col items-center gap-3">
                <button
                  onClick={async () => {
                    setImageSrc(null);
                    setProcessedImageSrc(null);
                    setCanvasReady(false);
                  }}
                  className="flex items-center gap-2 self-start"
                >
                  <IoMdArrowBack className="h-4 w-4" />
                  <p className="leading-7">Go back</p>
                </button>
                <canvas
                  ref={canvasRef}
                  className="max-h-[60vh] h-auto w-full max-w-2xl rounded-lg border shadow-sm"
                  aria-label="Preview of your text overlay on the processed image"
                  role="img"
                ></canvas>
              </div>
              <Card className="w-full max-w-2xl">
                <CardHeader>
                  <CardTitle>Edit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text">Text</Label>
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        id="text"
                        placeholder="Text in thumbnail"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="font">Font</Label>
                      <Select
                        value={font}
                        onValueChange={(value) => setFont(value)}
                      >
                        <SelectTrigger id="font">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="domine">Domine</SelectItem>
                          <SelectItem value="lato">Lato</SelectItem>
                          <SelectItem value="montserrat">Montserrat</SelectItem>
                          <SelectItem value="poppins">Poppins</SelectItem>
                          <SelectItem value="playfairDisplay">Playfair Display</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="horizontal-position">Horizontal Position (%)</Label>
                      <Input
                        id="horizontal-position"
                        type="number"
                        min="0"
                        max="100"
                        value={horizontalPosition}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                          setHorizontalPosition(value);
                        }}
                        placeholder="0-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="vertical-position">Vertical Position (%)</Label>
                      <Input
                        id="vertical-position"
                        type="number"
                        min="0"
                        max="100"
                        value={verticalPosition}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                          setVerticalPosition(value);
                        }}
                        placeholder="0-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text-size">Text Size (%)</Label>
                      <Input
                        id="text-size"
                        type="number"
                        min="10"
                        max="200"
                        value={textSize}
                        onChange={(e) => {
                          const value = Math.max(10, Math.min(200, Number(e.target.value) || 90));
                          setTextSize(value);
                        }}
                        placeholder="10-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-16 h-10 p-1 border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={textColor}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                              setTextColor(value);
                            }
                          }}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="text-opacity">Text Opacity (%)</Label>
                      <Slider
        id="text-opacity"
        min={0}
        max={100}
        step={1}
        value={[textOpacity]}
        onValueChange={(val: number[]) => setTextOpacity(val[0] ?? 100)}
        className="w-full"
      />
                      <div className="text-sm text-black text-center">
                        {textOpacity}%
                      </div>
                    </div>

                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                    <IoMdArrowBack className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={drawCompositeImage} className="w-full sm:w-auto">
                      Update
                    </Button>
                    <Button onClick={() => handleDownload()} className="w-full sm:w-auto">
                      Download
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 flex flex-col">
           <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Create your own backtext
            </h1>

          <p className="mt-2 leading-7 text-muted-foreground">
            Upload an image to get started
          </p>

           <Dropzone setSelectedImage={setSelectedImage} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="assertive">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default BacktextCreator;
